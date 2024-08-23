import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Competence } from "../../orm/entity/document/CompetenceEntity";
import { SimpleUser } from "../../models/user/SimpleUser";
import { DocumentTypes } from "../../interfaces/document/DocumentTypes";

const addCompetence = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const base: Partial<DocumentTypes.ICompetence> = JSON.parse(body.base);
    const issuer: string = new SimpleUser().build(req.user).username;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const competence: Competence = await new Competence()
        .build(base.code, base.position, base.name, issuer)
        .setFolderRelations(transactionalEntityManager, base.folderStructure);
      const savedCompetence = await dataSource.getRepository(Competence).save(competence);

      return res.status(201).json({
        added: [savedCompetence],
        message: "Competence added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation error code
      return res.status(400).json({
        message: "Competence with this name already exists",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    } else {
      console.error("Error adding competence: ", error);
      return res.status(500).json({
        message: "Unknown error occurred. Failed to add competence.",
        statusMessage: HttpResponseMessage.UNKNOWN,
      });
    }
  }
};

const editCompetence = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const base: Partial<DocumentTypes.ICompetence> = JSON.parse(body.base);
    const issuer: string = new SimpleUser().build(req.user).username;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const competence: Competence = await transactionalEntityManager
        .getRepository(Competence)
        .findOne({ where: { id: base.id } });

      if (!competence) {
        return res.status(404).json({
          message: "Competence not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }
      const savedCompetence: Competence = await transactionalEntityManager
        .getRepository(Competence)
        .save(competence.put(base.code, base.position, base.name, issuer));

      return res.status(200).json({
        edited: [savedCompetence],
        message: "Competence updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation error code
      return res.status(400).json({
        message: "Competence with this name already exists",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    } else {
      console.error("Error updating competence: ", error);
      return res.status(500).json({
        message: "Unknown error occurred. Failed to update competence.",
        statusMessage: HttpResponseMessage.UNKNOWN,
      });
    }
  }
};

const removeCompetence = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const competence: Competence = await transactionalEntityManager
        .getRepository(Competence)
        .findOne({ where: { id } });

      if (!competence) {
        return res.status(404).json({
          message: "Competence not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const deletedCompetence: Competence = await transactionalEntityManager
        .getRepository(Competence)
        .remove(competence);

      return res.status(200).json({
        deleted: [deletedCompetence],
        message: "Competence removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing competence: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove competence.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getCompetences = async (req: Request, res: Response) => {
  try {
    const { folderStructure } = req.params;
    const chips: string[] = JSON.parse(folderStructure).filter(
      (chip: string) => !!chip && chip !== null
    );

    const qb = dataSource.getRepository(Competence).createQueryBuilder("competence");

    if (chips.length > 0) {
      qb.where(
        `
      "competence"."folderStructure"[1:${chips.length}] = ARRAY[:...chips]::text[]
    `,
        { chips }
      );
    }

    const competences = await qb.getMany();

    return res.status(200).json({
      got: competences,
      message: "Competences retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving competences: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve competences.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addCompetence, editCompetence, removeCompetence, getCompetences };
