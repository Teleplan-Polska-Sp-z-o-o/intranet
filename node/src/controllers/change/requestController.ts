import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
import { IProcessChangeRequestBase } from "../../interfaces/change/IProcessChangeRequestBase";
import { IUser } from "../../interfaces/user/IUser";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";
import { ProcessChangeRequestUpdates } from "../../orm/entity/change/ProcessChangeRequestUpdatesEntity";
import { EmailHandler } from "../../models/common/Email/EmailHandler";
import { PCREmailOptions } from "../../models/common/Email/PCREmailOptions";

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

      const emailHandler = EmailHandler.getInstance();
      if (allFieldsFilled) {
        request.notification(transactionalEntityManager, "assigned completed");
        emailHandler.newEmail(new PCREmailOptions("assigned completed", request)).send();
      } else {
        request.notification(transactionalEntityManager, "assigned");
        emailHandler.newEmail(new PCREmailOptions("assigned", request)).send();
      }

      res.status(201).json({
        added: request,
        message: "Request added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
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
        .findOne({ where: { id }, relations: ["processChangeNotice"] });

      if (!request) {
        return res.status(404).json({
          message: "Request not found at request controller",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      if (request.status === "Closed") {
        const noticeId = request.processChangeNotice?.id;

        if (noticeId) {
          const notice = await transactionalEntityManager
            .getRepository(ProcessChangeNotice)
            .findOne({ where: { id: noticeId } });

          if (!notice) {
            return res.status(404).json({
              message: "Notice not found at request controller",
              statusMessage: HttpResponseMessage.PUT_ERROR,
            });
          }

          request.processChangeNotice = null;

          request = await transactionalEntityManager
            .getRepository(ProcessChangeRequest)
            .save(request);

          await transactionalEntityManager.getRepository(ProcessChangeNotice).remove(notice);
        }

        request.openRequest();
      }

      const assignedOwner = request.reconextOwner ? true : false;
      const baseContainsOwner = base.reconextOwner ? true : false;
      const reassigned = request.reconextOwner !== base.reconextOwner;

      const updatable = request.updatable;
      const emailHandler = EmailHandler.getInstance();

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
            if (reassigned) {
              request.notification(transactionalEntityManager, "reassigned");
              emailHandler.newEmail(new PCREmailOptions("reassigned", request)).send();
            }

            request.setRequestInfo(base);
            request = await transactionalEntityManager
              .getRepository(ProcessChangeRequest)
              .save(request);

            if (allFieldsFilled && !reassigned) {
              request.notification(transactionalEntityManager, "updated");
              emailHandler.newEmail(new PCREmailOptions("updated", request)).send();
            } else if (!allFieldsFilled && !reassigned) {
              request.notification(transactionalEntityManager, "updated uncompleted");
              emailHandler.newEmail(new PCREmailOptions("updated uncompleted", request)).send();
            } else if (!allFieldsFilled && reassigned) {
              request.notification(transactionalEntityManager, "assigned");
              emailHandler.newEmail(new PCREmailOptions("assigned", request)).send();
            } else if (allFieldsFilled && reassigned) {
              request.notification(transactionalEntityManager, "assigned updated");
              emailHandler.newEmail(new PCREmailOptions("assigned updated", request)).send();
            }

            break;
          }

        default:
          if (reassigned) {
            request.notification(transactionalEntityManager, "reassigned");
            emailHandler.newEmail(new PCREmailOptions("reassigned", request)).send();
          }

          request.setRequestInfo(base);
          request = await transactionalEntityManager
            .getRepository(ProcessChangeRequest)
            .save(request);

          if (allFieldsFilled && assignedOwner) {
            request.notification(transactionalEntityManager, "completed");
            emailHandler.newEmail(new PCREmailOptions("completed", request)).send();
          } else if (allFieldsFilled && !assignedOwner && baseContainsOwner) {
            request.notification(transactionalEntityManager, "assigned completed");
            emailHandler.newEmail(new PCREmailOptions("assigned completed", request)).send();
          } else if (!allFieldsFilled && !assignedOwner && baseContainsOwner) {
            request.notification(transactionalEntityManager, "assigned");
            emailHandler.newEmail(new PCREmailOptions("assigned", request)).send();
          }

          break;
      }

      res.status(200).json({
        edited: request,
        message: "Request updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
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
        const notice = new ProcessChangeNotice().build(request);

        processChangeNotice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice);

        const count = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .count({ where: { year: processChangeNotice.year } });

        processChangeNotice.setNoticeNo(count);

        await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(processChangeNotice);
      } else processChangeNotice = null;

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      request.closeRequest(assessment, approvedOrRejectedBy, processChangeNotice);

      request = await transactionalEntityManager.getRepository(ProcessChangeRequest).save(request);

      const emailHandler = EmailHandler.getInstance();

      if (request.assessment) {
        {
          request.notification(transactionalEntityManager, "closed");
          emailHandler.newEmail(new PCREmailOptions("closed", request)).send();
        }
      }

      res.status(200).json({
        closed: request,
        message: "Request closed successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
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

    await dataSource.transaction(async (transactionalEntityManager) => {
      const request = await transactionalEntityManager
        .getRepository(ProcessChangeRequest)
        .findOne({ where: { id }, relations: ["processChangeNotice"] });

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      const notice = request.processChangeNotice;
      request.processChangeNotice = null;
      await transactionalEntityManager.getRepository(ProcessChangeRequest).save(request);
      await transactionalEntityManager.getRepository(ProcessChangeNotice).remove(notice);
      const delRequest = await transactionalEntityManager
        .getRepository(ProcessChangeRequest)
        .remove(request);

      res.status(200).json({
        deleted: delRequest,
        message: "Request removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
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
    const requests = await dataSource
      .getRepository(ProcessChangeRequest)
      .find({ relations: ["processChangeNotice"] });

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
      relations: ["processChangeNotice"],
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
