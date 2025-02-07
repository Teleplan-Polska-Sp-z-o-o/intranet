import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { SimpleUser } from "../../models/user/SimpleUser";
import { TStepper } from "../../interfaces/document/creatorTypes";
import { Draft } from "../../orm/entity/document/creator/DraftEntity";
import { Repository } from "typeorm";
import DocumentGenerator from "../../models/docx/DocumentGenerator";
import { DeepLTranslator } from "../../models/docx/translator/DeepLTranslator";

const postDraft = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const stepper: TStepper = JSON.parse(body.stepper);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const repo: Repository<Draft> = transactionalEntityManager.getRepository(Draft);
      // Check if a draft with the same name already exists
      const existingByName = await repo.findOne({
        where: { name: stepper._name },
      });

      if (existingByName) {
        return res.status(400).json({
          hold: body.stepper,
          message: `A draft with the name "${stepper._name}" already exists.`,
          statusMessage: HttpResponseMessage.DRAFT_DUPLICATE_NAME,
        });
      }

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
      // console.log(
      //   "draft.stepper",
      //   draft.stepper.body.windows["3"].model.segments.at(0).subSegments.at(0)
      // );
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

const getDrafts = async (_req: Request, res: Response) => {
  try {
    await dataSource.transaction(async (transactionalEntityManager) => {
      const drafts: Draft[] = await transactionalEntityManager.getRepository(Draft).find();

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

      async function translateDraft(languageCode: string): Promise<TStepper> {
        // if (1 == 1) {
        //   const translator = new DeepLTranslator();
        //   const stepper: TStepper = draft.stepper;
        //   return translator.translateDraft(stepper, languageCode);
        // } else {
        return draft.stepper;
        // }
      }

      const translatedObject: TStepper = await translateDraft(language);

      const documentGenerator = new DocumentGenerator(deepSafeParse(translatedObject));
      const documentBuffer = await documentGenerator.generateDocument();
      const base64Document = documentBuffer.toString("base64");

      return res.status(200).json({
        generated: base64Document,
        message: `Document generated successfully`,
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error generating document: ", error);
    return res.status(500).json({
      message: `Unknown error occurred. Failed to generate document.`,
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { postDraft, putDraft, getDrafts, deleteDraft, generateDraft };
