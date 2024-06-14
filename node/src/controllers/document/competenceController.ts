import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Competence } from "../../orm/entity/document/CompetenceEntity";

const addCompetence = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const name: string = JSON.parse(body.name);
    const issuer: string = JSON.parse(body.issuer);

    const competence: Competence = new Competence().build(name, issuer);
    const savedCompetence = await dataSource.getRepository(Competence).save(competence);

    return res.status(201).json({
      added: savedCompetence,
      message: "Competence added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
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
    const id: number = Number(JSON.parse(body.id));
    const name: string = JSON.parse(body.name);
    const issuer: string = JSON.parse(body.issuer);

    let savedCompetence: Competence;
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
      savedCompetence = await transactionalEntityManager
        .getRepository(Competence)
        .save(competence.put(name, issuer));
    });

    return res.status(200).json({
      edited: savedCompetence,
      message: "Competence updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
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

const removeCompetence = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.params;

    const competence: Competence = await dataSource
      .getRepository(Competence)
      .findOne({ where: { id } });

    if (!competence) {
      return res.status(404).json({
        message: "Competence not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    const deletedCompetence: Competence = await dataSource
      .getRepository(Competence)
      .remove(competence);

    return res.status(200).json({
      deleted: deletedCompetence,
      message: "Competence removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing competence: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove competence.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getCompetences = async (_req: Request, res: Response) => {
  try {
    const competences = await dataSource.getRepository(Competence).find();

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
