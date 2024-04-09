import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
import { IProcessChangeRequestBase } from "../../interfaces/change/IProcessChangeRequestBase";
import { IUser } from "../../interfaces/user/IUser";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";

const addRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const requestedBy: IUser = JSON.parse(body.requestedBy);
    const base: IProcessChangeRequestBase = JSON.parse(body.base);

    let request: ProcessChangeRequest;

    await dataSource.transaction(async (transactionalEntityManager) => {
      request = new ProcessChangeRequest(requestedBy, base);

      request = await dataSource.getRepository(ProcessChangeRequest).save(request);

      const count = await transactionalEntityManager
        .getRepository(ProcessChangeRequest)
        .count({ where: { year: request.year } });

      request.setRequestNo(count);

      request = await dataSource.getRepository(ProcessChangeRequest).save(request);
    });

    res.status(201).json({
      added: request,
      message: "Request added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding request: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to add request.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editRequest = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.params;
    const body = req.body;

    const base: IProcessChangeRequestBase = JSON.parse(body.base);

    let request: ProcessChangeRequest = await dataSource
      .getRepository(ProcessChangeRequest)
      .findOne({ where: { id } });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    request.setRequestInfo(base);

    request = await dataSource.getRepository(ProcessChangeRequest).save(request);

    res.status(200).json({
      edited: request,
      message: "Request updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating request: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to update request.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const closeRequest = async (req: Request, res: Response) => {
  try {
    const { id, assessment }: { id: number; assessment: "Implementation" | "Rejection" } =
      req.params;
    const body = req.body;

    const approvedOrRejectedBy: IUser = JSON.parse(body.approvedOrRejectedBy);

    let processChangeNotice: ProcessChangeNotice | null;

    if (assessment === "Implementation") {
      processChangeNotice = await dataSource
        .getRepository(ProcessChangeNotice)
        .save(new ProcessChangeNotice());
    } else processChangeNotice = null;

    let request: ProcessChangeRequest = await dataSource
      .getRepository(ProcessChangeRequest)
      .findOne({ where: { id } });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    request.closeRequest(assessment, approvedOrRejectedBy, processChangeNotice);

    request = await dataSource.getRepository(ProcessChangeRequest).save(request);

    res.status(200).json({
      closed: request,
      message: "Request closed successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error closing request: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to close request.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeRequest = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.params;

    const request = await dataSource.getRepository(ProcessChangeRequest).findOne({ where: { id } });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.getRepository(ProcessChangeRequest).remove(request);

    res.status(200).json({
      deleted: request,
      message: "Request removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing request: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to remove request.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await dataSource.getRepository(ProcessChangeRequest).find();

    res.status(200).json({
      got: requests,
      message: "Requests retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving requests: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve requests.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addRequest, editRequest, closeRequest, removeRequest, getRequests };
