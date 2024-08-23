import { Request, Response } from "express";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/dataSource";
import * as fs from "fs";
import * as path from "path";
import { Language } from "../../orm/entity/document/LanguageEntity";
import { In } from "typeorm";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { Competence } from "../../orm/entity/document/CompetenceEntity";
import { Utils } from "../common/Utils";
import { DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";
import { SimpleUser } from "../../models/user/SimpleUser";
import { User } from "../../orm/entity/user/UserEntity";

const addDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const issuer: string = new SimpleUser().build(req.user).username;
    const uploadedFiles = req.files;

    await dataSource.transaction(async (transactionalEntityManager) => {
      let document = await new Document()
        .build(
          // base.ref,
          base.type,
          base.name,
          base.description,
          base.revision,

          base.confidentiality
        )
        .setFolderRelations(transactionalEntityManager, base.folderStructure);

      document = new Utils().addRecordPostInfo(issuer, document);

      let savedDocument: Document = await transactionalEntityManager
        .getRepository(Document)
        .save(document);

      // for (const [index, file] of uploadedFiles.entries()) {
      //   const languageName = files_langs[index].langs.join("_");

      //   const savedLanguage = await transactionalEntityManager
      //     .getRepository(Language)
      //     .save(new Language(languageName, savedDocument));

      //   const params = {
      //     langs: savedLanguage.name,
      //     uuid: savedDocument.ref,
      //   };

      //   const queryString = new URLSearchParams(params).toString();

      //   // Construct new file name
      //   const newFileName = `${savedDocument.name}_qs_${queryString}.pdf`;

      //   // Rename and move file to destination folder
      //   fs.renameSync(file.path, path.join(UPLOADS_PATH, DOCUMENTS_FOLDER, newFileName));
      // }

      await savedDocument.saveFiles(uploadedFiles, files_langs, transactionalEntityManager);

      // add competences
      const competenceIds = base.competences.map((competence: any) =>
        competence?.id ? Number(competence.id) : Number(competence)
      );

      savedDocument = await transactionalEntityManager.getRepository(Document).findOne({
        where: { id: savedDocument.id },
        relations: ["competences"],
      });
      if (!savedDocument) {
        return res.status(404).json({
          message: "Document not found",
          statusMessage: HttpResponseMessage.GET_ERROR,
        });
      }

      const competences = await transactionalEntityManager.getRepository(Competence).find({
        where: { id: In(competenceIds) },
      });
      if (!competences) {
        return res.status(404).json({
          message: "Competence not found",
          statusMessage: HttpResponseMessage.GET_ERROR,
        });
      }

      savedDocument.competences = [];
      for (const competence of competences) {
        savedDocument.competences.push(competence);
      }

      await transactionalEntityManager.getRepository(Document).save(savedDocument);

      return res.status(201).json({
        added: JSON.stringify(savedDocument),
        message: "Document added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    switch (error.message) {
      case "Reference value is of invalid format.":
        return res.status(400).json({
          message: error.message,
          statusMessage: HttpResponseMessage.REFERENCE_FORMAT_ERROR,
        });
      default:
        return res.status(500).json({
          message: "Failed to add document.",
          statusMessage: HttpResponseMessage.UNKNOWN,
        });
    }
  }
};

const editDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const issuer: string = new SimpleUser().build(req.user).username;
    const uploadedFiles = req.files;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const documentToUpdate = await transactionalEntityManager.getRepository(Document).findOne({
        where: {
          ref: base.ref,
        },
      });

      if (!documentToUpdate) {
        return res.status(404).json({
          message: "Document not found.",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const oldDocName = documentToUpdate.name;
      // documentToUpdate.name = base.name;
      // documentToUpdate.description = base.description;
      // documentToUpdate.revision = base.revision;
      // documentToUpdate.confidentiality = base.confidentiality;

      const oldRef = documentToUpdate.ref;

      await documentToUpdate.editDocument(
        // base.ref,
        base.type,
        base.name,
        base.description,
        base.revision,
        base.confidentiality
        // transactionalEntityManager
      );

      const documentToSave = new Utils().addRecordPutInfo<Document>(issuer, documentToUpdate);

      let updatedDocument = await transactionalEntityManager
        .getRepository(Document)
        .save(documentToSave);

      const languagesToDelete = await transactionalEntityManager
        .getRepository(Language)
        .find({ where: { document: updatedDocument } });

      for (const language of languagesToDelete) {
        await transactionalEntityManager.getRepository(Language).delete(language.id);

        const oldParams = {
          langs: language.name,
          uuid: oldRef,
        };
        const queryString = new URLSearchParams(oldParams).toString();

        const oldFileName = `${oldDocName}_qs_${queryString}.pdf`;
        fs.unlinkSync(path.join(UPLOADS_PATH, DOCUMENTS_FOLDER, oldFileName));
      }

      for (const [index, file] of uploadedFiles.entries()) {
        const languageName = files_langs[index].langs.join("_");

        const savedLanguage = await transactionalEntityManager
          .getRepository(Language)
          .save(new Language(languageName, updatedDocument));

        const params = {
          langs: savedLanguage.name,
          uuid: updatedDocument.ref,
        };

        const queryString = new URLSearchParams(params).toString();

        const newFileName = `${updatedDocument.name}_qs_${queryString}.pdf`;

        fs.renameSync(file.path, path.join(UPLOADS_PATH, DOCUMENTS_FOLDER, newFileName));
      }
      // add competences
      const competenceIds = base.competences.map((competence: any) =>
        competence?.id ? Number(competence.id) : Number(competence)
      );
      updatedDocument = await transactionalEntityManager.getRepository(Document).findOne({
        where: { id: updatedDocument.id },
        relations: ["competences"],
      });
      if (!updatedDocument) {
        return res.status(404).json({
          message: "Document not found",
          statusMessage: HttpResponseMessage.GET_ERROR,
        });
      }

      const competences = await transactionalEntityManager.getRepository(Competence).find({
        where: { id: In(competenceIds) },
      });
      if (!competences) {
        return res.status(404).json({
          message: "Competence not found",
          statusMessage: HttpResponseMessage.GET_ERROR,
        });
      }

      updatedDocument.competences = [];
      for (const competence of competences) {
        updatedDocument.competences.push(competence);
      }

      await transactionalEntityManager.getRepository(Document).save(updatedDocument);

      return res.status(200).json({
        edited: JSON.stringify(updatedDocument),
        message: "Document updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error editing document: ", error);
    switch (error.message) {
      case "Some document already contains this reference.":
        return res.status(400).json({
          message: error.message,
          statusMessage: HttpResponseMessage.REFERENCE_ALREADY_CONTAINS_ERROR,
        });
      default:
        return res.status(500).json({
          message: "Failed to edit document.",
          statusMessage: HttpResponseMessage.UNKNOWN,
        });
    }
  }
};

const toggleQuickAccess = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;
    const issuer: string = new SimpleUser().build(req.user).username;

    await dataSource.transaction(async (transactionalEntityManager) => {
      // Find the user and document by their respective ids
      const user = await transactionalEntityManager.getRepository(User).findOne({
        where: { username: issuer },
        relations: ["quickAccessDocuments"],
      });

      const document = await transactionalEntityManager
        .getRepository(Document)
        .findOne({ where: { id } });

      if (!user || !document) {
        return res.status(404).json({
          message: "User or Document not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      // Check if the document is already in the user's quick access list
      const isInQuickAccess = user.quickAccessDocuments.some((doc) => doc.id === document.id);

      if (isInQuickAccess) {
        user.quickAccessDocuments = user.quickAccessDocuments.filter(
          (doc) => doc.id !== document.id
        );
      } else {
        user.quickAccessDocuments.push(document);
      }

      // Save the updated user entity
      await transactionalEntityManager.getRepository(User).save(user);

      return res.status(200).json({
        message: isInQuickAccess
          ? "Document removed from Quick Access"
          : "Document added to Quick Access",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error toggling quick access: ", error);
    return res.status(500).json({
      message: "Failed to toggle quick access.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeDocument = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const documentToRemove = await transactionalEntityManager
        .getRepository(Document)
        .findOne({ where: { id } });

      if (!documentToRemove) {
        return res.status(404).json({
          message: "Document not found.",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      documentToRemove.removeFiles();

      const removedDocument = await transactionalEntityManager
        .getRepository(Document)
        .remove(documentToRemove);

      return res.status(200).json({
        deleted: removedDocument,
        message: "Document removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing document: ", error);
    return res.status(500).json({
      message: "Failed to remove document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getDocuments = async (
//   req: Request<{
//     type: "Instruction" | "Visual" | "all";
//     reduce: "true" | "false";
//     confidentiality: TConfidentiality;
//   }>,
//   res: Response
// ) => {
//   try {
//     const { type, reduce, confidentiality } = req.params;

//     let docOptions: IDocOptions = {
//       relations: ["languages", "competences"],
//     };

//     if (type !== "all") {
//       docOptions.where = {
//         type,
//         confidentiality: Not(In(Document.confidentialRestriction(confidentiality))),
//       };
//     }

//     let docs: Array<Document> = await dataSource.getRepository(Document).find(docOptions);

//     if (!docs) {
//       return res.status(404).json({
//         message: "Documents not found",
//         statusMessage: HttpResponseMessage.GET_ERROR,
//       });
//     }

//     if (reduce === "true") {
//       docs = docs.reduce((result, currentDoc) => {
//         const existingHighestRevision = result.find((doc) => doc.name === currentDoc.name);

//         if (!existingHighestRevision || currentDoc.revision > existingHighestRevision.revision) {
//           // Replace existing document or add a new one
//           result = [...result.filter((doc) => doc.name !== currentDoc.name), currentDoc];
//         }

//         return result;
//       }, []);
//     }

//     // Add languages array to each document record
//     const documents = docs.map((document) => {
//       return {
//         ...document,
//         languages: document.languages.map((language) => language.name),
//       };
//     });

//     return res.status(200).json({
//       documents: documents,
//       message: "Documents retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving documents: ", error);
//     return res.status(500).json({
//       message: "Failed to retrieve documents.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getDocuments = async (
  req: Request<{
    folderStructure: string;
    type: string;
    reduce: "true" | "false";
    confidentiality: TConfidentiality;
    quickAccess: "true" | "false";
  }>,
  res: Response
) => {
  try {
    const issuer: string = new SimpleUser().build(req.user).username;

    const { folderStructure, type, reduce, confidentiality, quickAccess } = req.params;
    const qb = dataSource.getRepository(Document).createQueryBuilder("document");

    qb.leftJoinAndSelect("document.languages", "language")
      .leftJoinAndSelect("document.competences", "competence")
      .leftJoinAndSelect("document.quickAccess", "user");

    const chips: string[] = JSON.parse(folderStructure).filter(
      (chip: string) => !!chip && chip !== null
    );
    if (chips.length > 0) {
      qb.where(
        `
      "document"."folderStructure"[1:${chips.length}] = ARRAY[:...chips]::text[]
    `,
        { chips }
      );
    } else {
      qb.where("1 = 1");
    }

    const confidentialityArray = Document.confidentialRestriction(confidentiality);
    if (confidentialityArray.length > 0) {
      qb.andWhere("document.confidentiality NOT IN (:...confidentiality)", {
        confidentiality: confidentialityArray,
      });
    }

    // Check if filtering by quick access is required
    if (quickAccess === "true") {
      qb.andWhere("user.username = :issuer", { issuer });
    }

    const typeArray = JSON.parse(type);
    if (typeArray.length) {
      qb.andWhere("document.type IN (:...type)", {
        type: typeArray,
      });
    } else {
      return res.status(200).json({
        documents: [],
        message: "Documents retrieved successfully",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    }

    let docs = await qb.getMany();

    if (reduce === "true") {
      docs = docs.reduce((result, currentDoc) => {
        const existingHighestRevision = result.find((doc) => doc.name === currentDoc.name);

        if (!existingHighestRevision || currentDoc.revision > existingHighestRevision.revision) {
          // Replace existing document or add a new one
          result = [...result.filter((doc) => doc.name !== currentDoc.name), currentDoc];
        }

        return result;
      }, []);
    }

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
        isQuickAccess: document.quickAccess.some((user) => user.username === issuer),
      };
    });

    return res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    return res.status(500).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentByUuidAndLangs = async (req: Request, res: Response) => {
  try {
    const { uuid, langs } = req.params;
    const docOptions = {
      where: {
        ref: uuid,
      },
    };

    const docs: Array<Document> = await dataSource.getRepository(Document).find(docOptions);
    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const docsIds: number[] = docs.map((doc) => doc.id);
    const docWithLangs: Language = await dataSource.getRepository(Language).findOne({
      where: {
        document: { id: In(docsIds) },
        name: langs,
      },
      relations: ["document"],
    });
    const document: Document = docs.find((doc) => doc.id === docWithLangs.document.id);
    return res.status(200).json({
      document: document,
      message: "Document retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving document: ", error);
    return res.status(500).json({
      message: "Failed to retrieve document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByNumber = async (req: Request<{ number: string }>, res: Response) => {
  try {
    const { number } = req.params;
    const docOptions = {
      where: {
        name: number,
      },
    };

    const documents: Array<Document> = await dataSource.getRepository(Document).find(docOptions);
    if (!documents) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    return res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    return res.status(500).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  addDocument,
  editDocument,
  toggleQuickAccess,
  removeDocument,
  getDocuments,
  getDocumentByUuidAndLangs,
  getDocumentsByNumber,
};
