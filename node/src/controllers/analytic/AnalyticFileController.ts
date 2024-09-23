import { Request, Response } from "express";
import { File } from "multer";
import { dataSource } from "../../config/dataSource";
import { SimpleUser } from "../../models/user/SimpleUser";
import { AnalyticFile } from "../../orm/entity/analytic/AnalyticFileEntity";
import { HttpResponseMessage } from "../../enums/response";

const postAnalyticFile = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // const id = JSON.parse(body.id);
    const progName = JSON.parse(body.progName);
    const catName = JSON.parse(body.catName);
    const subName = JSON.parse(body.subName);
    const normalizedFileName = JSON.parse(body.normalizedFileName);
    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const file: File = req.files.at(0);
    const fileType = JSON.parse(body.fileType);

    if (!file || !fileType || !progName || !catName || !subName || !normalizedFileName) {
      return res.status(400).json({
        message: "Missing required file or metadata fields.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      const analyticFileRepository = transactionalEntityManager.getRepository(AnalyticFile);

      const analyticFile = new AnalyticFile()
        .createReference()
        .specifySource(progName, catName, subName);

      await analyticFile.processFile(file, fileType, normalizedFileName);

      await analyticFileRepository.save(analyticFile.setCreatedBy(issuer));

      return res.status(201).json({
        added: [analyticFile],
        message: "AnalyticFile added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding AnalyticFile: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const putAnalyticFile = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const id = JSON.parse(body.id);
    const normalizedFileName = JSON.parse(body.normalizedFileName);
    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const file: File = req.files.at(0);
    const fileType = JSON.parse(body.fileType);

    if (!file || !fileType || !normalizedFileName) {
      return res.status(400).json({
        message: "Missing required file or metadata fields.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      const analyticFileRepository = transactionalEntityManager.getRepository(AnalyticFile);

      const analyticFile = await analyticFileRepository.findOne({ where: { id } });

      if (!analyticFile) {
        return res.status(404).json({
          message: "AnalyticFile not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      await analyticFile.processFile(file, fileType, normalizedFileName);

      await analyticFileRepository.save(analyticFile.addUpdatedBy(issuer));

      return res.status(200).json({
        edited: [analyticFile],
        message: "AnalyticFile edited successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error editing AnalyticFile: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const restoreAnalyticFile = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    if (!id || !issuer) {
      return res.status(400).json({
        message: "Missing metadata fields.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      const analyticFileRepository = transactionalEntityManager.getRepository(AnalyticFile);
      const analyticFile = await analyticFileRepository.findOne({ where: { id } });

      if (!analyticFile) {
        return res.status(404).json({
          message: "AnalyticFile not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      analyticFile.restoreFile();

      await analyticFileRepository.save(analyticFile.addUpdatedBy(issuer));

      return res.status(200).json({
        edited: [analyticFile],
        message: "AnalyticFile edited successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error editing AnalyticFile: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getAnalyticFiles = async (req: Request, res: Response) => {
  try {
    const analyticFiles = await dataSource.getRepository(AnalyticFile).find();

    if (!analyticFiles) {
      return res.status(404).json({
        message: "AnalyticFiles not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    return res.status(200).json({
      got: analyticFiles,
      message: "AnalyticFiles retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving AnalyticFiles: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve AnalyticFiles.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getAnalyticFileById = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Missing required id.",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const analyticFile = await dataSource.getRepository(AnalyticFile).findOne({ where: { id } });

    if (!analyticFile) {
      return res.status(404).json({
        message: "AnalyticFile not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    return res.status(200).json({
      got: [analyticFile],
      message: "AnalyticFile retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving AnalyticFile: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve file.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getByProgAndCatAndSub = async (
  req: Request<{ progName: string; catName: string; subName: string }>,
  res: Response
) => {
  try {
    const { progName, catName, subName } = req.params;

    if (!progName || !catName || !subName) {
      return res.status(400).json({
        message: "Missing required metadata fields.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    const analyticFiles = await dataSource
      .getRepository(AnalyticFile)
      .find({ where: { progName, catName, subName } });

    return res.status(200).json({
      got: analyticFiles,
      message: "AnalyticFiles retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving AnalyticFiles: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve files.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const deleteAnalyticFile = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Missing required id.",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.transaction(async (transactionalEntityManager) => {
      const analyticFileRepository = transactionalEntityManager.getRepository(AnalyticFile);

      const analyticFile = await analyticFileRepository.findOne({ where: { id } });

      if (!analyticFile) {
        return res.status(404).json({
          message: "AnalyticFile not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      analyticFile.deleteFiles();

      await analyticFileRepository.remove(analyticFile);

      return res.status(200).json({
        removed: [analyticFile],
        message: "AnalyticFile removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing AnalyticFile: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  postAnalyticFile,
  putAnalyticFile,
  restoreAnalyticFile,
  getAnalyticFiles,
  getAnalyticFileById,
  getByProgAndCatAndSub,
  deleteAnalyticFile,
};
