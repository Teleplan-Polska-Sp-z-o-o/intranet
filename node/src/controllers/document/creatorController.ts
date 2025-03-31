import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage, TransCreateDocsResponseMessage } from "../../enums/response";
import { SimpleUser } from "../../models/user/SimpleUser";
import { EStepperStatus, StatusHistory, TStepper } from "../../interfaces/document/creatorTypes";
import { Draft } from "../../orm/entity/document/creator/DraftEntity";
import { Repository } from "typeorm";
import { DOCXGenerator } from "../../models/docx/DOCXGenerator";
import { MSTranslatorError } from "../../models/docx/translator/MSTranslatorTypes";
import { File } from "multer";
import path from "path";
import { CREATOR_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";
import { mkdir, rename, writeFile } from "fs/promises";
import { NotificationBuilder } from "../../orm/entity/user/NotificationBuilder";
import { saveNotification } from "../common/notificationController";
import { ENotificationSource } from "../../interfaces/user/notification/ENotificationSource";
import { ENotificationAction } from "../../interfaces/user/notification/ENotificationAction";
import { User } from "../../orm/entity/user/UserEntity";
import archiver from "archiver";
import { readFile } from "fs/promises";

const postDraft = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const stepper: TStepper = JSON.parse(body.stepper);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);
      // Check if a draft with the same name already exists
      // const existingByName = await repo.findOne({
      //   where: { name: stepper._name },
      // });

      // if (existingByName) {
      //   return res.status(400).json({
      //     hold: body.stepper,
      //     message: `A draft with the name "${stepper._name}" already exists.`,
      //     statusMessage: HttpResponseMessage.DRAFT_DUPLICATE_NAME,
      //   });
      // }

      // Check if a draft with the same UUID already exists
      const existingByUuid = await repo.findOne({
        where: { uuid: stepper.uuid },
      });

      if (existingByUuid) {
        return res.status(400).json({
          hold: body.stepper,
          message: `A draft with the UUID "${stepper.uuid}" already exists.`,
          statusMessage: HttpResponseMessage.DRAFT_DUPLICATE_UUID,
        });
      }

      const draft: Draft = new Draft().build(stepper).setCreatedBy(issuer);
      draft.stepper._statusHistory.push(new StatusHistory(0, EStepperStatus.DRAFT, issuer, ""));

      const savedDraft = await repo.save(draft);

      return res.status(201).json({
        saved: [savedDraft],
        message: `Draft added successfully`,
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding draft: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to add draft.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const putDraft = async (req: Request<{ id: number }>, res: Response) => {
  const body = req.body;
  try {
    const { id } = req.params;
    const stepper: TStepper = JSON.parse(body.stepper);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);

      const draft: Draft = await repo.findOne({ where: { id } });

      if (!draft) {
        return res.status(404).json({
          message: `Draft not found`,
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      draft.name = stepper._name;
      draft.stepper = stepper;
      draft.addUpdatedBy(issuer);

      await repo.save(draft);

      return res.status(200).json({
        edited: [draft],
        message: "Draft updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating draft: ", error);

    return res.status(500).json({
      message: "Unknown error occurred. Failed to update draft.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDrafts = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const createdByMe: boolean = JSON.parse(body.createdByMe); // if true look for createdBy.user.id === user.id
    const ofStepperStatus: number[] = JSON.parse(body.ofStepperStatus); // look for stepper._status

    await dataSource.transaction(async (transactionalEntityManager) => {
      const queryBuilder = transactionalEntityManager
        .getRepository(Draft)
        .createQueryBuilder("draft");

      if (createdByMe) {
        queryBuilder.andWhere(`draft."createdBy"->'user'->>'id' = :userId`, {
          userId: issuer.id.toString(),
        });
      }

      if (ofStepperStatus.length > 0) {
        queryBuilder.andWhere(`(draft."stepper"->>'_status')::int IN (:...status)`, {
          status: ofStepperStatus,
        });
      }

      const drafts: Draft[] = await queryBuilder.getMany();

      return res.status(200).json({
        retrieved: drafts,
        message: `Drafts retrieved successfully`,
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error retrieving Drafts: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to retrieve Drafts.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Save uploaded files to appropriate folder based on status.
 */
const storeUploadedFiles = async (
  draft: Draft,
  files: File[] | undefined,
  status: EStepperStatus
): Promise<void> => {
  if (!files || files.length === 0) return;

  let folder = "";
  switch (status) {
    case EStepperStatus.RELEASED:
      folder = "released";
      break;
    case EStepperStatus.ARCHIVED:
      folder = "archive";
      break;
  }

  const destinationFolder = path.join(UPLOADS_PATH, CREATOR_DOCUMENTS_FOLDER, folder);

  try {
    // Ensure folder exists
    await mkdir(destinationFolder, { recursive: true });

    for (const file of files) {
      const destinationPath = path.join(destinationFolder, file.originalname);
      await writeFile(destinationPath, file.buffer);
      draft.stepper.fileNames.push(file.originalname);
      // console.log("draft.stepper.fileNames", draft.stepper.fileNames);
    }
  } catch (err) {
    console.error("Error storing uploaded files:", err);
    throw err;
  }
};

/**
 * Move existing files from one status folder to another.
 */
const moveFileBetweenFolders = async (fileNames: string[]): Promise<void> => {
  const sourceFolder = path.join(UPLOADS_PATH, CREATOR_DOCUMENTS_FOLDER, "released");
  const destinationFolder = path.join(UPLOADS_PATH, CREATOR_DOCUMENTS_FOLDER, "archive");

  try {
    await mkdir(destinationFolder, { recursive: true });

    for (const fileName of fileNames) {
      const oldPath = path.join(sourceFolder, fileName);
      const newPath = path.join(destinationFolder, fileName);

      // console.log("oldPath, newPath", oldPath, newPath);
      await rename(oldPath, newPath); // Move file
      // console.log("rename done");
    }
  } catch (err) {
    throw err;
  }
};

const changeStatusOfDraft = async (
  req: Request<{ id: number; status: EStepperStatus }>,
  res: Response
) => {
  try {
    const { id, status } = req.params;
    const body = req.body;

    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const files = req.files;

    const comment: string = JSON.parse(body.comment);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const userRepo: Repository<User> = transactionalEntityManager.getRepository(User);
      const documentControlUser: User = await userRepo.findOne({
        where: { username: "anna.gandziarowska" },
      });

      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);

      const draft: Draft = await repo.findOne({ where: { id } });

      if (!draft) {
        return res.status(404).json({
          message: `Draft not found`,
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      const docId = draft.stepper.body.windows[2].model._id;
      // const providedRevision = parseInt(
      //   draft.stepper.body.windows[2].model._revision.replace("R", ""),
      //   10
      // );
      const nextHistoryId = draft.stepper._statusHistory.length;

      switch (Number(status)) {
        case EStepperStatus.DRAFT:
          draft.stepper._status = EStepperStatus.DRAFT;
          draft.stepper._statusHistory.push(
            new StatusHistory(nextHistoryId, EStepperStatus.DRAFT, issuer, comment)
          );

          break;
        case EStepperStatus.FOR_RELEASE:
          draft.stepper._status = EStepperStatus.FOR_RELEASE;
          draft.stepper._statusHistory.push(
            new StatusHistory(nextHistoryId, EStepperStatus.FOR_RELEASE, issuer, comment)
          );

          const userNotification = new NotificationBuilder(
            ENotificationSource.TCD,
            ENotificationAction.AcceptOrReject
          )
            .setUser(documentControlUser)
            .setTitle("TransCreateDocs: Ready for Release")
            .setSubtitle("A draft has been submitted for release and awaits your approval.")
            .setLink("/tool/transCreateDocs/browse/dashboard")
            .build();
          saveNotification(userNotification);

          break;
        case EStepperStatus.RELEASED:
          draft.stepper._status = EStepperStatus.RELEASED;
          draft.stepper._statusHistory.push(
            new StatusHistory(nextHistoryId, EStepperStatus.RELEASED, issuer, comment)
          );

          storeUploadedFiles(draft, files, EStepperStatus.RELEASED);

          const previousReleasedDraft = await transactionalEntityManager
            .getRepository(Draft)
            .createQueryBuilder("draft")
            .where(`draft."stepper"->'body'->'windows'->'2'->'model'->>'_id' = :docId`, { docId })
            .andWhere(`draft.id != :currentDraftId`, { currentDraftId: draft.id })
            .andWhere(`(draft."stepper"->>'_status')::int = :releasedStatus`, {
              releasedStatus: EStepperStatus.RELEASED,
            })
            .getOne();

          if (previousReleasedDraft) {
            previousReleasedDraft.stepper._status = EStepperStatus.ARCHIVED;
            previousReleasedDraft.stepper._statusHistory.push(
              new StatusHistory(nextHistoryId, EStepperStatus.ARCHIVED, issuer, "")
            );

            moveFileBetweenFolders(previousReleasedDraft.stepper.fileNames);

            await repo.save(previousReleasedDraft);
          }

          break;
      }

      await repo.save(draft);

      return res.status(200).json({
        message: `Changed of Draft status successfully`,
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error changing status of draft: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to remove draft.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const downloadFiles = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const body = req.body;
    const fileNamesToDownload = JSON.parse(body.fileNamesToDownload);

    if (!fileNamesToDownload || !Array.isArray(fileNamesToDownload)) {
      return res.status(400).json({
        message: `fileNamesToDownload must be provided as an array.`,
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    const repo: Repository<Draft> = dataSource.getRepository(Draft);
    const draft = await repo.findOne({ where: { id: Number(id) } });

    if (!draft) {
      return res.status(404).json({
        message: `Draft not found`,
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    // Validate requested files exist in draft
    const matchingFiles = draft.stepper.fileNames.filter((fileName) =>
      fileNamesToDownload.includes(fileName)
    );

    if (matchingFiles.length === 0) {
      return res.status(404).json({
        message: "No matching files found for the provided file names.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${draft.stepper._documentIdRevision}_documents.zip`
    );

    archive.pipe(res);

    const folder = draft.stepper._status === EStepperStatus.RELEASED ? "released" : "archive";

    for (const fileName of matchingFiles) {
      const filePath = path.join(UPLOADS_PATH, CREATOR_DOCUMENTS_FOLDER, folder, fileName);
      try {
        const fileBuffer = await readFile(filePath);
        archive.append(fileBuffer, { name: fileName });
      } catch (err) {
        console.error(`File not found in folder '${folder}': ${fileName}`);
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error downloading files:", error);
    return res.status(500).json({
      message: "Failed to process file download.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const deleteDraft = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);

      const draft: Draft = await repo.findOne({ where: { id } });

      if (!draft) {
        return res.status(404).json({
          message: `Draft not found`,
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      await repo.remove(draft);

      return res.status(200).json({
        deleted: [draft],
        message: `Draft removed successfully`,
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing draft: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to remove draft.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const generateDraft = async (
  req: Request<{ id: number; language: string; tz: string }>,
  res: Response
) => {
  try {
    const { id, language } = req.params;

    const issuer = new SimpleUser().build(req.user);
    const token = req.headers["authorization"];

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);

      const draft: Draft = await repo.findOne({ where: { id } });

      if (!draft) {
        return res.status(404).json({
          message: `Draft not found`,
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      }

      function deepSafeParse<T>(item: unknown): T {
        try {
          if (typeof item === "string") {
            return deepSafeParse(JSON.parse(item)); // Parse the string and recursively process it
          } else if (typeof item === "object" && item !== null) {
            if (Array.isArray(item)) {
              // Recursively process each item in the array
              return item.map((element) => deepSafeParse(element)) as unknown as T;
            } else {
              // Recursively process each key-value pair in the object
              return Object.entries(item).reduce((acc, [key, value]) => {
                (acc as Record<string, unknown>)[key] = deepSafeParse(value);
                return acc;
              }, {} as Record<string, unknown>) as T;
            }
          }
          return item as T; // Return as-is if not a string or object
        } catch {
          return item as T; // Return as-is if parsing fails
        }
      }

      const documentGenerator = new DOCXGenerator(
        deepSafeParse<TStepper>(draft.stepper),
        issuer,
        token
      );
      const documentBuffer = await documentGenerator.generateDocument(language);
      const base64Document = documentBuffer.toString("base64");

      return res.status(200).json({
        generated: base64Document,
        message: `Document generated successfully`,
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    if (error.statusMessage === TransCreateDocsResponseMessage.TEMPLATE_NOT_FOUND) {
      return res.status(404).json({
        message: "The requested document template was not found.",
        statusMessage: error.statusMessage,
      });
    }

    if (error instanceof MSTranslatorError) {
      return res.status(500).json(error.toJSON());
    }

    console.error("Error generating document: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to generate document.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const checkRevision = async (req: Request<{ docId: string; revision: string }>, res: Response) => {
  try {
    const docId = req.params.docId;
    const providedRevision = parseInt(req.params.revision.replace("R", ""), 10);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const drafts = await transactionalEntityManager
        .getRepository(Draft)
        .createQueryBuilder("draft")
        .where(`draft."stepper"->'body'->'windows'->'2'->'model'->>'_id' = :docId`, {
          docId,
        })
        .getMany();

      const revisions = drafts.map((d) =>
        parseInt(d.stepper.body.windows[2].model._revision.replace("R", ""), 10)
      );

      const maxRevision = revisions.length > 0 ? Math.max(...revisions) : 0;

      return res.status(200).json({
        isValid: providedRevision > maxRevision ? true : false,
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error checking revision: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to check revision.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  postDraft,
  putDraft,
  getDrafts,
  changeStatusOfDraft,
  downloadFiles,
  deleteDraft,
  generateDraft,
  checkRevision,
};
