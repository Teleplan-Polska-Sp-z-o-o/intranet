import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { UserAcknowledgement } from "../../orm/entity/document/acknowledgement/UserAcknowledgementEntity";
import { ToAcknowledge } from "../../orm/entity/document/acknowledgement/ToAcknowledgeEntity";
import { User } from "../../orm/entity/user/UserEntity";
import { AcknowledgementTypes } from "../../interfaces/acknowledgement/AcknowledgementTypes";
import { SimpleUser } from "../../models/user/SimpleUser";

const addUserAcknowledgement = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const toAcknowledgeId: number = JSON.parse(body.toAcknowledgeId);
    // const userId: number = JSON.parse(body.userId);
    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const acknowledged: boolean = JSON.parse(body.acknowledged);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const toAcknowledge = await transactionalEntityManager
        .getRepository(ToAcknowledge)
        .findOne({ where: { id: toAcknowledgeId } });

      if (!toAcknowledge) {
        return res.status(404).json({
          message: "ToAcknowledge entity not found",
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      }

      const user = await transactionalEntityManager
        .getRepository(User)
        .findOne({ where: { id: issuer.id } });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          statusMessage: HttpResponseMessage.POST_ERROR,
        });
      }

      const userAcknowledgement = new UserAcknowledgement()
        .upsert(toAcknowledge, user, acknowledged)
        .setCreatedBy(issuer);

      const addedAcknowledgement = await transactionalEntityManager
        .getRepository(UserAcknowledgement)
        .save(userAcknowledgement);

      return res.status(201).json({
        added: [addedAcknowledgement],
        message: "UserAcknowledgement added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding UserAcknowledgement: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to add UserAcknowledgement.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editUserAcknowledgement = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const id: number = JSON.parse(body.id);
    const toAcknowledgeId: number = JSON.parse(body.toAcknowledgeId);
    // const userId: number = JSON.parse(body.userId);
    const issuer: SimpleUser = new SimpleUser().build(req.user);
    const acknowledged: boolean = JSON.parse(body.acknowledged);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const existingAcknowledgement = await transactionalEntityManager
        .getRepository(UserAcknowledgement)
        .findOne({ where: { id }, relations: ["toAcknowledge", "user"] });

      if (!existingAcknowledgement) {
        return res.status(404).json({
          message: "UserAcknowledgement not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      // Check if the toAcknowledge and user are the same to avoid unnecessary queries
      const sameToAcknowledge = existingAcknowledgement.toAcknowledge.id === toAcknowledgeId;
      const sameUser = existingAcknowledgement.user.id === issuer.id;
      const sameAcknowledgement = existingAcknowledgement.acknowledged === acknowledged;

      const toAcknowledge: ToAcknowledge | undefined = sameToAcknowledge
        ? undefined
        : await transactionalEntityManager.getRepository(ToAcknowledge).findOne({
            where: { id: toAcknowledgeId },
          });

      const user: User | undefined = sameUser
        ? undefined
        : await transactionalEntityManager.getRepository(User).findOne({
            where: { id: issuer.id },
          });

      if (sameToAcknowledge && sameUser && sameAcknowledgement) {
        return res.status(200).json({
          edited: [existingAcknowledgement],
          message: "No changes detected. UserAcknowledgement was not updated.",
          statusMessage: HttpResponseMessage.PUT_SUCCESS,
        });
      }

      existingAcknowledgement.upsert(toAcknowledge, user, acknowledged).addUpdatedBy(issuer);

      const updatedAcknowledgement = await transactionalEntityManager
        .getRepository(UserAcknowledgement)
        .save(existingAcknowledgement);

      return res.status(200).json({
        edited: [updatedAcknowledgement],
        message: "UserAcknowledgement updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating UserAcknowledgement: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update UserAcknowledgement.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeUserAcknowledgement = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const acknowledgementToRemove = await transactionalEntityManager
        .getRepository(UserAcknowledgement)
        .findOne({ where: { id } });

      if (!acknowledgementToRemove) {
        return res.status(404).json({
          message: "UserAcknowledgement not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      await transactionalEntityManager
        .getRepository(UserAcknowledgement)
        .remove(acknowledgementToRemove);

      return res.status(200).json({
        deleted: [acknowledgementToRemove],
        message: "UserAcknowledgement removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error removing UserAcknowledgement: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to remove UserAcknowledgement.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

/**
 * Retrieves all UserAcknowledgement entries, optionally filtered by the provided source flags.
 *
 * This endpoint retrieves entries from the `UserAcknowledgement` table. If a `source` query parameter
 * is provided, it will filter the entries based on the flags contained within the `source` object,
 * such as `isSafetyDocument`.
 *
 * @param {Request} req - The request object, containing optional `source` query parameter.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A JSON response with the retrieved entries or an error message.
 */
const getUserAcknowledgements = async (
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
      relations: ["toAcknowledge", "user"];
      where?: { toAcknowledge: Partial<AcknowledgementTypes.IIs & { closed: boolean }> };
    } = { relations: ["toAcknowledge", "user"] };
    if (source || closed !== undefined) {
      queryOptions.where = { toAcknowledge: {} };

      if (closed !== undefined) {
        queryOptions.where.toAcknowledge.closed = closed;
      }

      if (source.isSafetyDocument) {
        queryOptions.where.toAcknowledge.isSafetyDocument = source.isSafetyDocument;
      }
    }

    const userAcknowledgements: UserAcknowledgement[] = await dataSource
      .getRepository(UserAcknowledgement)
      .find(queryOptions);

    return res.status(200).json({
      got: userAcknowledgements,
      message: "UserAcknowledgements retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving UserAcknowledgements: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve UserAcknowledgements.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  addUserAcknowledgement,
  editUserAcknowledgement,
  removeUserAcknowledgement,
  getUserAcknowledgements,
};
