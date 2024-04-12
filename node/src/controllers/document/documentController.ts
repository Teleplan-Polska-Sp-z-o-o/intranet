import { Request, Response } from "express";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/orm/dataSource";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Language } from "../../orm/entity/document/LanguageEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { In } from "typeorm";
import { IDocOptions } from "../../interfaces/document/IDocOptions";

const addDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const target = JSON.parse(body.target);
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

      const document = new Document(
        uuidv4(),
        base.type,
        base.name,
        base.description,
        base.revision,
        subcategory
      );

      const savedDocument = await transactionalEntityManager.getRepository(Document).save(document);

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
        fs.renameSync(
          file.path,
          path.join(__dirname, "..", "..", "..", "uploads", "documents", newFileName)
        );
      }

      res.status(201).json({
        added: JSON.stringify(savedDocument),
        message: "Document added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({
      message: "Failed to add document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
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

      documentToUpdate.name = base.name;
      documentToUpdate.description = base.description;
      documentToUpdate.revision = base.revision;

      const updatedDocument = await transactionalEntityManager
        .getRepository(Document)
        .save(documentToUpdate);

      const languagesToDelete = await transactionalEntityManager
        .getRepository(Language)
        .find({ where: { document: updatedDocument } });

      for (const language of languagesToDelete) {
        await transactionalEntityManager.getRepository(Language).delete(language.id);

        const oldParams = {
          langs: language.name,
          uuid: updatedDocument.ref,
        };
        const queryString = new URLSearchParams(oldParams).toString();

        const oldFileName = `${oldDocName}_qs_${queryString}.pdf`;
        fs.unlinkSync(path.join(__dirname, "..", "..", "..", "uploads", "documents", oldFileName));
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

        fs.renameSync(
          file.path,
          path.join(__dirname, "..", "..", "..", "uploads", "documents", newFileName)
        );
      }

      res.status(200).json({
        edited: JSON.stringify(updatedDocument),
        message: "Document updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error editing document: ", error);
    res.status(500).json({
      message: "Failed to edit document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeDocument = async (req: Request, res: Response) => {
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
      const directory = path.join(__dirname, "..", "..", "..", "uploads", "documents");
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

      res.status(200).json({
        deleted: removedDocument,
        message: "Document removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing document: ", error);
    res.status(500).json({
      message: "Failed to remove document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocuments = async (req: Request, res: Response) => {
  try {
    const { type, reduce } = req.params;

    let docOptions: IDocOptions = {
      relations: ["languages"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
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
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(500).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDep = async (req: Request, res: Response) => {
  try {
    const { departmentName, type, reduce } = req.params;

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
      },
      relations: ["languages"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: {
          category: {
            department: departmentEntity,
          },
        },
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
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(500).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDepCat = async (req: Request, res: Response) => {
  try {
    const { departmentName, categoryName, type, reduce } = req.params;

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

    const catOptions = {
      where: {
        name: categoryName,
        department: departmentEntity,
      },
    };
    const categoryEntity = await dataSource.getRepository(Category).find(catOptions);

    if (!categoryEntity) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const subOptions = {
      where: {
        category: categoryEntity,
      },
    };
    const subcategories = await dataSource.getRepository(Subcategory).find(subOptions);

    // Extract subcategory IDs to use in the document query
    const subcategoryIds = subcategories.map((subcategory) => subcategory.id);

    let docOptions: IDocOptions = {
      where: {
        subcategory: In(subcategoryIds),
      },
      relations: ["languages"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: In(subcategoryIds),
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
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(500).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDepCatSub = async (req: Request, res: Response) => {
  try {
    const { departmentName, categoryName, subcategoryName, type, reduce } = req.params;
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

    const catOptions = {
      relations: {
        department: true,
      },
      where: {
        name: categoryName,
        department: departmentEntity,
      },
    };
    const categoryEntity = await dataSource.getRepository(Category).find(catOptions);
    if (!categoryEntity) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const subOptions = {
      relations: {
        category: {
          department: true,
        },
      },
      where: {
        name: subcategoryName,
        category: categoryEntity,
      },
    };
    const subcategoryEntity = await dataSource.getRepository(Subcategory).find(subOptions);

    let docOptions: IDocOptions = {
      where: {
        subcategory: subcategoryEntity,
      },
      relations: ["languages"],
    };

    if (type !== "all") {
      docOptions.where = {
        type,
        subcategory: subcategoryEntity,
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
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(500).json({
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
};
