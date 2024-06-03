import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";
import { IProcessChangeNoticeFields } from "../../interfaces/change/IProcessChangeNoticeFields";
import { IUser } from "../../interfaces/user/IUser";
import { User } from "../../orm/entity/user/UserEntity";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
import { IsNull, Not } from "typeorm";
import { ProcessChangeNoticeUpdates } from "../../orm/entity/change/ProcessChangeNoticeUpdatesEntity";
import { ENotificationVariant } from "../../interfaces/user/notification/ENotificationVariant";

const editNotice = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const fields: IProcessChangeNoticeFields = JSON.parse(body.fields);
    const id: number = JSON.parse(body.noticeId);
    const assesser: IUser = JSON.parse(body.assesser);

    let notice: ProcessChangeNotice;
    await dataSource.transaction(async (transactionalEntityManager) => {
      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .findOne({ where: { id } });
      if (!notice) {
        return res.status(404).json({
          message: "Notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const request = await transactionalEntityManager.getRepository(ProcessChangeRequest).findOne({
        relations: ["processChangeNotice"],
        where: { processChangeNotice: { id: notice.id } },
      });

      const assignation = notice.assignation(fields);
      const updateFields = notice.compare(fields);

      if (notice.status === "Closed" && updateFields.length > 0) {
        notice.open();
      }

      if (updateFields.length === 0) {
        return res.status(200).json({
          message: "No fields require update",
          statusMessage: HttpResponseMessage.PUT_SUCCESS,
        });
      }

      if (notice.updatable) {
        let noticeUpdates = new ProcessChangeNoticeUpdates();
        noticeUpdates.build(
          notice,
          assesser,
          JSON.stringify(updateFields),
          fields.updateDescription
        );

        noticeUpdates = await transactionalEntityManager
          .getRepository(ProcessChangeNoticeUpdates)
          .save(noticeUpdates);

        if (!noticeUpdates) {
          return res.status(400).json({
            message: "Notice Updates not saved",
            statusMessage: HttpResponseMessage.PUT_ERROR,
          });
        }

        if (assignation.reassigned) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.Reassigned
          );
          notice.sendEmails(recipients, ENotificationVariant.Reassigned);
        }

        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.setNoticeFields(fields));

        if (assignation.assigned) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.Assigned
          );
          notice.sendEmails(recipients, ENotificationVariant.Assigned);
        }

        if (notice.isFilled()) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.UpdatedCompleted
          );
          notice.sendEmails(recipients, ENotificationVariant.UpdatedCompleted);
        } else {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.UpdatedUncompleted
          );
          notice.sendEmails(recipients, ENotificationVariant.UpdatedUncompleted);
        }

        return res.status(200).json({
          edited: notice,
          message: "Notice updated successfully",
          statusMessage: HttpResponseMessage.PUT_SUCCESS,
        });
      }

      if (!notice.updatable) {
        if (assignation.reassigned) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.Reassigned
          );
          notice.sendEmails(recipients, ENotificationVariant.Reassigned);
        }

        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.setNoticeFields(fields));

        if (assignation.assigned) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.Assigned
          );
          notice.sendEmails(recipients, ENotificationVariant.Assigned);
        }

        if (notice.isFilled()) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            ENotificationVariant.Completed
          );
          notice.sendEmails(recipients, ENotificationVariant.Completed);
        }

        return res.status(200).json({
          edited: notice,
          message: "Notice updated successfully",
          statusMessage: HttpResponseMessage.PUT_SUCCESS,
        });
      }
    });
  } catch (error) {
    console.error("Error updating notice: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const assessNotice = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const assesser: User = JSON.parse(body.assesser);
    const id: number = JSON.parse(body.noticeId);
    const { assessment }: { assessment: "approve" | "rejection" } = req.params;

    if (!assesser.info.decisionMaker) {
      return res.status(401).json({
        message: "Assesser is not a decision maker",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    let notice: ProcessChangeNotice;
    await dataSource.transaction(async (transactionalEntityManager) => {
      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .findOne({ where: { id } });
      if (!notice) {
        return res.status(404).json({
          message: "Notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const request = await transactionalEntityManager.getRepository(ProcessChangeRequest).findOne({
        relations: ["processChangeNotice"],
        where: { processChangeNotice: { id: notice.id } },
      });

      if (notice.status === "Open") {
        notice.close();
      }

      const assess: {
        notice: ProcessChangeNotice;
        assessments: { eng: boolean; qua: boolean; ded: boolean };
      } = notice.assess(request, assesser.info.department, assesser.username, assessment);

      if (!assess.notice) {
        return res.status(404).json({
          message: "Assess notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      // const recipients: User | Array<User> = await notice.notification(
      //       transactionalEntityManager,
      //       request,
      //       ENotificationVariant.Completed
      //     );
      //     notice.sendEmails(recipients, ENotificationVariant.Completed);

      if (assess.assessments.eng) {
        const recipients: User | Array<User> = await notice.notification(
          transactionalEntityManager,
          request,
          notice.updatable
            ? ENotificationVariant.UpdatedEngineeringApproval
            : ENotificationVariant.EngineeringApproval
        );
        notice.sendEmails(
          recipients,
          notice.updatable
            ? ENotificationVariant.UpdatedEngineeringApproval
            : ENotificationVariant.EngineeringApproval
        );
      } else if (assess.assessments.qua && !assess.notice.dedicatedDepartmentApproval) {
        if (notice.updatable) {
          const recipients: User | Array<User> = await notice.notification(
            transactionalEntityManager,
            request,
            notice.updatable
              ? ENotificationVariant.UpdatedQualityApproval
              : ENotificationVariant.QualityApproval
          );
          notice.sendEmails(
            recipients,
            notice.updatable
              ? ENotificationVariant.UpdatedQualityApproval
              : ENotificationVariant.QualityApproval
          );
        }
      }

      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .save(assess.notice);

      return res.status(200).json({
        assessed: notice,
        message: "Notices retrieved successfully",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error assessing notice: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to assess notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNotice = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.params;
    const objectConfig = {
      where: { id, processChangeNotice: Not(IsNull()) },
      relations: ["processChangeNotice"],
    };

    const request = await dataSource.getRepository(ProcessChangeRequest).findOne(objectConfig);
    return res.status(200).json({
      got: request,
      message: "Notice retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving notice: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNotices = async (_req: Request, res: Response) => {
  try {
    const objectConfig = {
      where: { processChangeNotice: Not(IsNull()) },
      relations: ["processChangeNotice"],
      order: { id: "DESC" as const },
    };

    const requests = await dataSource.getRepository(ProcessChangeRequest).find(objectConfig);

    return res.status(200).json({
      got: requests,
      message: "Requests retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving requests: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve requests.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const getNotices = async (_req: Request, res: Response) => {
//   try {
//     const requests = await dataSource
//       .getRepository(ProcessChangeRequest)
//       .createQueryBuilder("request")
//       .leftJoinAndSelect("request.processChangeNotice", "processChangeNotice")
//       .where("processChangeNotice IS NOT NULL") // Equivalent to Not(IsNull())
//       .orderBy("request.id", "DESC")
//       .getMany();

//     res.status(200).json({
//       got: requests,
//       message: "Requests retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving requests: ", error);
//     res.status(500).json({
//       message: "Unknown error occurred. Failed to retrieve requests.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

export { editNotice, getNotice, getNotices, assessNotice };
