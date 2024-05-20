import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";
import { IProcessChangeNoticeFields } from "../../interfaces/change/IProcessChangeNoticeFields";
import { IUser } from "../../interfaces/user/IUser";
import { User } from "../../orm/entity/user/UserEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";
import { IsNull, Not } from "typeorm";
import { ProcessChangeNoticeUpdates } from "../../orm/entity/change/ProcessChangeNoticeUpdatesEntity";

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
      console.log("notice", notice);
      if (!notice) {
        return res.status(404).json({
          message: "Notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      //   const emailHandler = EmailHandler.getInstance();

      if (notice.status === "Closed") {
        notice.open();
      }
      console.log("notice.updatable", notice.updatable);
      if (notice.updatable) {
        const updateFields = notice.compare(fields);
        console.log(1, updateFields);
        console.log("updateFields.length === 0", updateFields.length === 0);
        // if (updateFields.length === 0) {
        //   return res.status(200).json({
        //     message: "No fields require update",
        //     statusMessage: HttpResponseMessage.PUT_SUCCESS,
        //   });
        // }

        let noticeUpdates = new ProcessChangeNoticeUpdates();
        noticeUpdates.build(
          notice,
          assesser,
          JSON.stringify(updateFields),
          fields.updateDescription
        );
        console.log(2);

        noticeUpdates = await transactionalEntityManager
          .getRepository(ProcessChangeNoticeUpdates)
          .save(noticeUpdates);
        console.log(3);
        if (!noticeUpdates) {
          return res.status(400).json({
            message: "Notice Updates not saved",
            statusMessage: HttpResponseMessage.PUT_ERROR,
          });
        } else {
          // if (reassigned) {
          //   request.notification(transactionalEntityManager, "reassigned");
          //   emailHandler.newEmail(new PCREmailOptions("reassigned", request)).send();
          // }

          notice = await transactionalEntityManager
            .getRepository(ProcessChangeNotice)
            .save(notice.setNoticeFields(fields));
          console.log(5);
          // if (allFieldsFilled && !reassigned) {
          //   request.notification(transactionalEntityManager, "updated");
          //   emailHandler.newEmail(new PCREmailOptions("updated", request)).send();
          // } else if (!allFieldsFilled && !reassigned) {
          //   request.notification(transactionalEntityManager, "updated uncompleted");
          //   emailHandler.newEmail(new PCREmailOptions("updated uncompleted", request)).send();
          // } else if (!allFieldsFilled && reassigned) {
          //   request.notification(transactionalEntityManager, "assigned");
          //   emailHandler.newEmail(new PCREmailOptions("assigned", request)).send();
          // } else if (allFieldsFilled && reassigned) {
          //   request.notification(transactionalEntityManager, "assigned updated");
          //   emailHandler.newEmail(new PCREmailOptions("assigned updated", request)).send();
          // }
        }
      } else {
        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.setNoticeFields(fields));
        console.log(6);
      }

      res.status(200).json({
        edited: notice,
        message: "Notice updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error updating notice: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const assessNotice = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const assesser: IUser = JSON.parse(body.assesser);
    const id: number = JSON.parse(body.noticeId);
    const { assessment }: { assessment: "approve" | "rejection" } = req.params;

    let notice: ProcessChangeNotice;
    await dataSource.transaction(async (transactionalEntityManager) => {
      console.log(1);
      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .findOne({ where: { id } });
      if (!notice) {
        return res.status(404).json({
          message: "Notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }
      // const request = await transactionalEntityManager.getRepository(ProcessChangeRequest).findOne({
      //   relations: ["processChangeNotice"],
      //   where: { processChangeNotice: notice },
      // });
      const request = await transactionalEntityManager.getRepository(ProcessChangeRequest).findOne({
        relations: ["processChangeNotice"],
        where: { processChangeNotice: { id: notice.id } },
      });

      const user = await transactionalEntityManager
        .getRepository(User)
        .findOne({ where: { id: assesser.id }, relations: ["info"] });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const department = await transactionalEntityManager
        .getRepository(Department)
        .findOne({ where: { name: user.info.department } });

      if (notice.status === "Open") {
        notice.close();
      }

      if (user.info.decisionMaker) {
        //   const emailHandler = EmailHandler.getInstance();
        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.assess(request, department, user, assessment));
      }

      res.status(200).json({
        assessed: notice,
        message: "Notices retrieved successfully",
        statusMessage: HttpResponseMessage.GET_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error assessing notice: ", error);
    res.status(500).json({
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

    res.status(200).json({
      got: request,
      message: "Notice retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving notice: ", error);
    res.status(500).json({
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
