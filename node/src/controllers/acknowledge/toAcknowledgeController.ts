import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { ToAcknowledge } from "../../orm/entity/document/acknowledgement/ToAcknowledgeEntity";
import { Quiz } from "../../orm/entity/document/acknowledgement/QuizEntity";
import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";
import { SimpleUser } from "../../models/user/SimpleUser";

/**
 * Adds a new ToAcknowledge entry.
 *
 * @param {Request} req - The request object, containing the body with:
 *  - documentRef: string (required) - The reference for the document(s) to acknowledge.
 *  - quiz: number | null (optional) - The ID of the quiz associated with the acknowledgment.
 *  - description: string (required) - A description or purpose of the acknowledgment.
 *  - acknowledgementStartDate: Date | null (optional) - The start date when the acknowledgment should appear.
 *  - ofSource: AcknowledgementTypes.IIs - object of source properties like isSafetyDocument
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response indicating success or failure.
 */
const addToAcknowledge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;
    const documentRef: string = JSON.parse(body.documentRef);
    const quizId: number | null = JSON.parse(body.quiz);
    const description: string = JSON.parse(body.description);
    const acknowledgementStartDate: Date | null = JSON.parse(body.acknowledgementStartDate);
    const ofSource: AcknowledgementTypes.IIs = JSON.parse(body.ofSource);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const documents: Document[] = await transactionalEntityManager
        .getRepository(Document)
        .find({ where: { ref: documentRef } });
      if (!documents) {
        return res.status(404).json({
          message: "Document not found",
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      }

      const quiz: Quiz | null | undefined =
        quizId === null
          ? undefined
          : await transactionalEntityManager.getRepository(Quiz).findOne({ where: { id: quizId } });
      if (quiz === null) {
        return res.status(404).json({
          message: "Quiz not found",
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      }

      const toAcknowledge: ToAcknowledge = new ToAcknowledge()
        .upsert(documents, quiz, description, acknowledgementStartDate)
        .is(ofSource)
        .setCreatedBy(issuer);
      const added: ToAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .save(toAcknowledge);

      return res.status(201).json({
        added: [added],
        message: "ToAcknowledge added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding ToAcknowledge: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Edits an existing ToAcknowledge entry.
 *
 * @param {Request} req - The request object, containing the body with:
 *  - toAcknowledgeId: number (required) - The ID of the ToAcknowledge entry to edit.
 *  - documentRef: string (required) - The reference for the document(s) to acknowledge.
 *  - quiz: number | null (optional) - The ID of the quiz associated with the acknowledgment.
 *  - description: string (required) - A description or purpose of the acknowledgment.
 *  - acknowledgementStartDate: Date | null (optional) - The start date when the acknowledgment should appear.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response indicating success or failure.
 */
const editToAcknowledge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;
    const id: number = JSON.parse(body.id);
    const documentRef: string = JSON.parse(body.documentRef);
    const quizId: number | null = JSON.parse(body.quiz);
    const description: string = JSON.parse(body.description);
    const acknowledgementStartDate: Date | null = JSON.parse(body.acknowledgementStartDate);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const toAcknowledge: ToAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .findOne({ relations: ["document", "quiz"], where: { id } });

      const sameDocuments = toAcknowledge.documents.every((doc) => doc.ref === documentRef);
      const documents: Document[] | undefined = sameDocuments
        ? undefined
        : await transactionalEntityManager
            .getRepository(Document)
            .find({ where: { ref: documentRef } });
      if (Array.isArray(documents) && !documents.length) {
        return res.status(404).json({
          message: "Documents not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const sameQuiz = toAcknowledge.quiz.id === quizId;
      const quiz: Quiz | undefined = sameQuiz
        ? undefined
        : await transactionalEntityManager.getRepository(Quiz).findOne({ where: { id: quizId } });

      toAcknowledge
        .upsert(documents, quiz, description, acknowledgementStartDate)
        .addUpdatedBy(issuer);

      const edited = await dataSource.getRepository(ToAcknowledge).save(toAcknowledge);

      return res.status(200).json({
        edited: [edited],
        message: "ToAcknowledge edited successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating ToAcknowledge: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update ToAcknowledge.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Closes a ToAcknowledge entry by ID.
 *
 * @param {Request<{ id: number }>} req - The request object, containing the params with:
 *  - id: number (required) - The ID of the ToAcknowledge entry to close.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response indicating success or failure.
 */
const closeToAcknowledge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body;
    const id: number = JSON.parse(body.id);
    const issuer: SimpleUser = new SimpleUser().build(req.user);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const toAcknowledge: ToAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .findOne({ where: { id } });

      if (!toAcknowledge) {
        return res.status(404).json({
          message: "ToAcknowledge not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      // Mark the entry as closed
      toAcknowledge.close().addUpdatedBy(issuer);

      const closedToAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .save(toAcknowledge);

      return res.status(200).json({
        closed: [closedToAcknowledge],
        message: "ToAcknowledge closed successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error closing ToAcknowledge: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to close ToAcknowledge.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Removes a ToAcknowledge entry by ID.
 *
 * @param {Request<{ id: number }>} req - The request object, containing the params with:
 *  - id: number (required) - The ID of the ToAcknowledge entry to remove.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response indicating success or failure.
 */
const removeToAcknowledge = async (
  req: Request<{ id: number }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const toAcknowledge: ToAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .findOne({ where: { id } });

      if (!toAcknowledge) {
        return res.status(404).json({
          message: "ToAcknowledge not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      await transactionalEntityManager.getRepository(ToAcknowledge).remove(toAcknowledge);

      return res.status(200).json({
        deleted: [toAcknowledge],
        message: "ToAcknowledge removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing ToAcknowledge: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove ToAcknowledge.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Retrieves all ToAcknowledge entries, optionally filtered by the provided source flags.
 *
 * This endpoint retrieves entries from the `ToAcknowledge` table. If a `source` query parameter
 * is provided, it will filter the entries based on the flags contained within the `source` object,
 * such as `isSafetyDocument`. In the future, this can be extended to include additional filters
 * like `isTrainingDocument`.
 *
 * @param {Request} req - The request object, containing optional `source` query parameter.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response with the retrieved entries or an error message.
 */
const getToAcknowledges = async (
  req: Request<{
    source: string;
    // AcknowledgementTypes.IIs
    closed: string;
    // boolean
  }>,
  res: Response
): Promise<Response> => {
  try {
    const closed: boolean | undefined =
      req.query.closed !== undefined ? JSON.parse(req.query.closed as string) : undefined;

    const source: AcknowledgementTypes.IIs = req.params.source
      ? JSON.parse(req.params.source)
      : undefined;

    // Build the query options based on the source flags
    const queryOptions: {
      relations: ["document", "quiz"];
      where?: Partial<AcknowledgementTypes.IIs & { closed: boolean }>;
    } = { relations: ["document", "quiz"] };
    if (source || closed !== undefined) {
      queryOptions.where = {};

      if (closed !== undefined) {
        queryOptions.where.closed = closed;
      }

      if (source.isSafetyDocument) {
        queryOptions.where.isSafetyDocument = source.isSafetyDocument;
      }
    }

    const toAcknowledges: ToAcknowledge[] = await dataSource
      .getRepository(ToAcknowledge)
      .find(queryOptions);

    return res.status(200).json({
      got: toAcknowledges,
      message: "ToAcknowledges retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving ToAcknowledges: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve ToAcknowledges.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  addToAcknowledge,
  editToAcknowledge,
  closeToAcknowledge,
  removeToAcknowledge,
  getToAcknowledges,
};
