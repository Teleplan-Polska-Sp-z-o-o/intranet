import { Request, Response } from "express";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/orm/dataSource";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
import * as fs from "fs";
import * as path from "path";
import { Language } from "../../orm/entity/document/LanguageEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { In, Not } from "typeorm";
import { IDocOptions } from "../../interfaces/document/IDocOptions";
import { TConfidentiality } from "../../interfaces/user/UserTypes";
import { Competence } from "../../orm/entity/document/CompetenceEntity";
import { Utils } from "../common/Utils";
import { MulterRequest } from "../../interfaces/common/MulterRequest";
import { DOCUMENTS_FOLDER, UPLOADS_PATH } from "../../config/routeConstants";

const addDocument = async (req: MulterRequest, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const target = JSON.parse(body.target);
    const issuer: string = JSON.parse(body.issuer);
    const uploadedFiles = req.files;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const subcategory = await transactionalEntityManager.getRepository(Subcategory).findOne({
        where: {
          name: target.subcategoryName,
          category: {
            name: target.categoryName,
            department: {
              name: target.departmentName,
            },
          },
        },
      });

      let document = new Document().build(
        // base.ref,
        base.type,
        base.name,
        base.description,
        base.revision,
        subcategory,
        base.confidentiality
      );

      document = new Utils().addRecordPostInfo(issuer, document);

      let savedDocument: Document = await transactionalEntityManager
        .getRepository(Document)
        .save(document);

      for (const [index, file] of uploadedFiles.entries()) {
        const languageName = files_langs[index].langs.join("_");

        const savedLanguage = await transactionalEntityManager
          .getRepository(Language)
          .save(new Language(languageName, savedDocument));

        const params = {
          langs: savedLanguage.name,
          uuid: savedDocument.ref,
        };

        const queryString = new URLSearchParams(params).toString();

        // Construct new file name
        const newFileName = `${savedDocument.name}_qs_${queryString}.pdf`;

        // Rename and move file to destination folder
        fs.renameSync(file.path, path.join(UPLOADS_PATH, DOCUMENTS_FOLDER, newFileName));
      }

      // add competences
      const competenceIds = base.competences.map((competence: any) =>
        competence?.id ? Number(competence.id) : Number(competence)
      );

      savedDocument = await transactionalEntityManager.getRepository(Document).findOne({
        where: { id: savedDocument.id },
        relations: ["competences", "subcategory"],
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

const editDocument = async (req: MulterRequest, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const issuer: string = JSON.parse(body.issuer);
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
        relations: ["competences", "subcategory"],
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

// const approveDocument = async (req: Request<{ ref: string }>, res: Response) => {
//   try {
//     const ref = req.body.ref;

//     await dataSource.transaction(async (transactionalEntityManager) => {
//       const documentToUpdate = await transactionalEntityManager.getRepository(Document).findOne({
//         where: {
//           ref,
//         },
//       });

//       if (!documentToUpdate) {
//         return res.status(404).json({
//           message: "Document not found.",
//           statusMessage: HttpResponseMessage.PUT_ERROR,
//         });
//       }

//       const updatedDocument = await transactionalEntityManager
//         .getRepository(Document)
//         .save(documentToUpdate);

//       return res.status(200).json({
//         edited: JSON.stringify(updatedDocument),
//         message: "Document approved successfully",
//         statusMessage: HttpResponseMessage.PUT_SUCCESS,
//       });
//     });
//   } catch (error) {
//     console.error("Error approving document: ", error);
//     return res.status(500).json({
//       message: "Failed to approve document.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

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

      const documentRef = documentToRemove.ref;
      const directory = path.join(UPLOADS_PATH, DOCUMENTS_FOLDER);
      const files = fs.readdirSync(directory);
      // Filter files that contain the document's reference in their names
      const filesToDelete = files.filter((file) => file.includes(documentRef));

      // Delete each file
      filesToDelete.forEach((file) => {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
      });

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

const confidentialRestriction = (confidentiality: TConfidentiality) => {
  try {
    switch (confidentiality) {
      case "restricted":
        return ["secret"];
      case "secret":
        return [];

      default:
        return ["restricted", "secret"];
    }
  } catch (error) {
    console.error(`confidentialRestriction at documentController, ${error}`);
  }
};

const getDocuments = async (
  req: Request<{
    type: "Instruction" | "Visual" | "all";
    reduce: "true" | "false";
    confidentiality: TConfidentiality;
  }>,
  res: Response
) => {
  try {
    const { type, reduce, confidentiality } = req.params;

    let docOptions: IDocOptions = {
      relations: ["languages", "subcategory", "competences"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      };
    }

    let docs: Array<Document> = await dataSource.getRepository(Document).find(docOptions);

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

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

    // Add languages array to each document record
    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
        subcategory: document.subcategory,
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

const getDocumentsByDep = async (
  req: Request<{
    departmentName: string;
    type: string;
    reduce: "true" | "false";
    confidentiality: TConfidentiality;
  }>,
  res: Response
) => {
  try {
    const { departmentName, type, reduce, confidentiality } = req.params;

    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departmentEntity = await dataSource.getRepository(Department).find(depOptions);

    if (!departmentEntity) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    let docOptions: IDocOptions = {
      where: {
        subcategory: {
          category: {
            department: departmentEntity,
          },
        },
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      },
      relations: ["languages", "subcategory", "competences"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: {
          category: {
            department: departmentEntity,
          },
        },
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      };
    }

    let docs = await dataSource.getRepository(Document).find(docOptions);

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
        subcategory: document.subcategory,
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

const getDocumentsByDepCat = async (
  req: Request<{
    departmentName: string;
    categoryName: string;
    type: string;
    reduce: "true" | "false";
    confidentiality: TConfidentiality;
  }>,
  res: Response
) => {
  try {
    const { departmentName, categoryName, type, reduce, confidentiality } = req.params;

    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departments = await dataSource.getRepository(Department).find(depOptions);

    if (!departments) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const departmentIds = departments.map((department) => department.id);

    const catOptions = {
      where: {
        name: categoryName,
        department: In(departmentIds),
      },
    };
    const categories = await dataSource.getRepository(Category).find(catOptions);

    if (!categories) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const categoryIds = categories.map((category) => category.id);

    const subOptions = {
      where: {
        category: In(categoryIds),
      },
    };
    const subcategories = await dataSource.getRepository(Subcategory).find(subOptions);

    // Extract subcategory IDs to use in the document query
    const subcategoryIds = subcategories.map((subcategory) => subcategory.id);

    let docOptions: IDocOptions = {
      where: {
        subcategory: In(subcategoryIds),
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      },
      relations: ["languages", "subcategory", "competences"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: In(subcategoryIds),
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      };
    }

    let docs = await dataSource.getRepository(Document).find(docOptions);

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
        subcategory: document.subcategory,
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

const getDocumentsByDepCatSub = async (
  req: Request<{
    departmentName: string;
    categoryName: string;
    subcategoryName: string;
    type: string;
    reduce: "true" | "false";
    confidentiality: TConfidentiality;
  }>,
  res: Response
) => {
  try {
    const { departmentName, categoryName, subcategoryName, type, reduce, confidentiality } =
      req.params;
    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departments = await dataSource.getRepository(Department).find(depOptions);
    if (!departments) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const departmentsIds = departments.map((department) => department.id);

    const catOptions = {
      relations: {
        department: true,
      },
      where: {
        name: categoryName,
        department: In(departmentsIds),
      },
    };
    const categories = await dataSource.getRepository(Category).find(catOptions);
    if (!categories) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const categoriesIds = categories.map((category) => category.id);

    const subOptions = {
      relations: {
        category: {
          department: true,
        },
      },
      where: {
        name: subcategoryName,
        category: In(categoriesIds),
      },
    };
    const subcategories = await dataSource.getRepository(Subcategory).find(subOptions);

    const subcategoriesIds = subcategories.map((subcategory) => subcategory.id);

    let docOptions: IDocOptions = {
      where: {
        subcategory: In(subcategoriesIds),
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      },
      relations: ["languages", "subcategory", "competences"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: In(subcategoriesIds),
        confidentiality: Not(In(confidentialRestriction(confidentiality))),
      };
    }

    let docs = await dataSource.getRepository(Document).find(docOptions);

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
        subcategory: document.subcategory,
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
  removeDocument,
  getDocuments,
  getDocumentsByDep,
  getDocumentsByDepCat,
  getDocumentsByDepCatSub,
  getDocumentByUuidAndLangs,
  getDocumentsByNumber,
};
