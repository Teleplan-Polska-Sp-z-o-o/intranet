import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Quiz } from "../../orm/entity/document/acknowledgement/QuizEntity";
const addQuiz = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const quizName: string = JSON.parse(body.quizName);
    const quizFolderStructure: string[] = JSON.parse(body.quizFolderStructure);
    const quizData: string = JSON.parse(body.quiz);
    const ref: string = JSON.parse(body.ref);
    const files: File[] = req.files as File[];

    await dataSource.transaction(async (transactionalEntityManager) => {
      const quizObject = JSON.parse(quizData); // Convert string to QuizTypes.IQuiz
      const newQuiz = new Quiz().upsertQuiz(quizName, quizFolderStructure, quizObject, ref);

      // Save associated quiz files
      if (files && files.length > 0) {
        newQuiz.saveQuizFiles(files);
      }

      const addedQuiz = await transactionalEntityManager.getRepository(Quiz).save(newQuiz);

      return res.status(201).json({
        added: [addedQuiz],
        message: "Quiz added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding Quiz: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add Quiz.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editQuiz = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const id: number = JSON.parse(body.id);
    const quizName: string = JSON.parse(body.quizName);
    const quizFolderStructure: string[] = JSON.parse(body.quizFolderStructure);
    const quizData: string = JSON.parse(body.quiz);
    const ref: string = JSON.parse(body.ref);
    const files: File[] = req.files as File[]; // Assuming multer handles file uploads

    await dataSource.transaction(async (transactionalEntityManager) => {
      const existingQuiz = await transactionalEntityManager
        .getRepository(Quiz)
        .findOne({ where: { id } });

      if (!existingQuiz) {
        return res.status(404).json({
          message: "Quiz not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      // Delete existing media files before updating
      existingQuiz.deleteQuizFiles();

      const quizObject = JSON.parse(quizData); // Convert string to QuizTypes.IQuiz
      existingQuiz.upsertQuiz(quizName, quizFolderStructure, quizObject, ref);

      // Save new files if provided
      if (files && files.length > 0) {
        existingQuiz.saveQuizFiles(files);
      }

      const updatedQuiz = await transactionalEntityManager.getRepository(Quiz).save(existingQuiz);

      return res.status(200).json({
        edited: [updatedQuiz],
        message: "Quiz updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating Quiz: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update Quiz.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeQuiz = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const quizToRemove = await transactionalEntityManager
        .getRepository(Quiz)
        .findOne({ where: { id } });

      if (!quizToRemove) {
        return res.status(404).json({
          message: "Quiz not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      // Delete associated media files before removing the quiz entity
      quizToRemove.deleteQuizFiles();

      await transactionalEntityManager.getRepository(Quiz).remove(quizToRemove);

      return res.status(200).json({
        deleted: [quizToRemove],
        message: "Quiz removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing Quiz: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove Quiz.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getQuizzes = async (req: Request, res: Response) => {
  try {
    const all: Quiz[] = await dataSource.getRepository(Quiz).find();

    return res.status(200).json({
      got: all,
      message: "Quizzes retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Quizzes: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve Quizzes.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addQuiz, editQuiz, removeQuiz, getQuizzes };
