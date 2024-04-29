import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
import { IProcessChangeRequestBase } from "../../interfaces/change/IProcessChangeRequestBase";
import { IUser } from "../../interfaces/user/IUser";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";
import { ProcessChangeRequestUpdates } from "../../orm/entity/change/ProcessChangeRequestUpdatesEntity";

const addRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const requestedBy: IUser = JSON.parse(body.requestedBy);
    const base: IProcessChangeRequestBase = JSON.parse(body.base);

    let request: ProcessChangeRequest;
    const allFieldsFilled = Object.values(base).every((value) => !!value);

    await dataSource.transaction(async (transactionalEntityManager) => {
      request = new ProcessChangeRequest().build(requestedBy, base);

      request = await transactionalEntityManager.getRepository(ProcessChangeRequest).save(request);

      const count = await transactionalEntityManager
        .getRepository(ProcessChangeRequest)
        .count({ where: { year: request.year } });

      request.setRequestNo(count);

      request = await transactionalEntityManager.getRepository(ProcessChangeRequest).save(request);
      if (allFieldsFilled) request.notification(transactionalEntityManager, "assigned completed");
      else request.notification(transactionalEntityManager, "assigned");
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
    const body = req.body;

    const base: IProcessChangeRequestBase = JSON.parse(body.base);
    const requestedBy: IUser = JSON.parse(body.requestedBy);
    const id: number = JSON.parse(body.requestId);

    let request: ProcessChangeRequest;
    const allFieldsFilled = Object.values(base).every((value) => !!value);

    await dataSource.transaction(async (transactionalEntityManager) => {
      request = await transactionalEntityManager
        .getRepository(ProcessChangeRequest)
        .findOne({ where: { id } });

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const statusClosed = request.status === "Closed";
      if (statusClosed) {
        request.openRequest();
      }

      const assignedOwner = request.reconextOwner ? true : false;
      const baseContainsOwner = base.reconextOwner ? true : false;
      const reassigned = request.reconextOwner !== base.reconextOwner;

      const updatable = request.updatable;

      switch (updatable) {
        case true:
          const updateFields = request.compare(base);
          if (updateFields.length === 0) {
            return res.status(200).json({
              message: "No fields require update",
              statusMessage: HttpResponseMessage.PUT_SUCCESS,
            });
          }

          let requestUpdates = new ProcessChangeRequestUpdates();
          requestUpdates.build(
            request,
            requestedBy,
            JSON.stringify(updateFields),
            base.updateDescription
          );

          requestUpdates = await transactionalEntityManager
            .getRepository(ProcessChangeRequestUpdates)
            .save(requestUpdates);

          if (!requestUpdates) {
            return res.status(400).json({
              message: "Request Updates not saved",
              statusMessage: HttpResponseMessage.PUT_ERROR,
            });
          } else {
            if (reassigned) request.notification(transactionalEntityManager, "reassigned");

            request.setRequestInfo(base);
            request = await transactionalEntityManager
              .getRepository(ProcessChangeRequest)
              .save(request);

            if (allFieldsFilled && !reassigned)
              request.notification(transactionalEntityManager, "updated");
            else if (!allFieldsFilled && !reassigned)
              request.notification(transactionalEntityManager, "updated uncompleted");
            else if (!allFieldsFilled && reassigned)
              request.notification(transactionalEntityManager, "assigned");
            else if (allFieldsFilled && reassigned)
              request.notification(transactionalEntityManager, "assigned updated");

            break;
          }

        default:
          if (reassigned) request.notification(transactionalEntityManager, "reassigned");

          request.setRequestInfo(base);
          request = await transactionalEntityManager
            .getRepository(ProcessChangeRequest)
            .save(request);

          if (allFieldsFilled && assignedOwner)
            request.notification(transactionalEntityManager, "completed");
          else if (allFieldsFilled && !assignedOwner && baseContainsOwner)
            request.notification(transactionalEntityManager, "assigned completed");
          else if (!allFieldsFilled && !assignedOwner && baseContainsOwner)
            request.notification(transactionalEntityManager, "assigned");

          break;
      }
    });

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
    const { assessment }: { assessment: "Implementation" | "Rejection" } = req.params;
    const body = req.body;

    const id: number = JSON.parse(body.requestId);
    const approvedOrRejectedBy: IUser = JSON.parse(body.approvedOrRejectedBy);

    let processChangeNotice: ProcessChangeNotice | null;
    let request: ProcessChangeRequest = await dataSource
      .getRepository(ProcessChangeRequest)
      .findOne({ where: { id } });

    await dataSource.transaction(async (transactionalEntityManager) => {
      if (assessment === "Implementation") {
        processChangeNotice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(new ProcessChangeNotice());
      } else processChangeNotice = null;

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      request.closeRequest(assessment, approvedOrRejectedBy, processChangeNotice);

      request = await transactionalEntityManager.getRepository(ProcessChangeRequest).save(request);

      if (request.assessment) {
        request.notification(transactionalEntityManager, "closed");
      }
    });

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

const getRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const options = {
      where: { id },
    };

    const request: ProcessChangeRequest = await dataSource
      .getRepository(ProcessChangeRequest)
      .findOne(options);

    res.status(200).json({
      got: request,
      message: "Request retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving request: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve request.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addRequest, editRequest, closeRequest, removeRequest, getRequest, getRequests };
