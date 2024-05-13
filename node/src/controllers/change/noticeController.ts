import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { ProcessChangeNotice } from "../../orm/entity/change/ProcessChangeNoticeEntity";
import { IProcessChangeNoticeFields } from "../../interfaces/change/IProcessChangeNoticeFields";
import { IUser } from "../../interfaces/user/IUser";
import { User } from "../../orm/entity/user/UserEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { ProcessChangeRequest } from "../../orm/entity/change/ProcessChangeRequestEntity";

const editNotice = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const fields: IProcessChangeNoticeFields = JSON.parse(body.fields);
    const id: number = JSON.parse(body.noticeId);

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

      //   const emailHandler = EmailHandler.getInstance();

      if (notice.status === "Closed") {
        notice.open();
      } else {
      }

      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .save(notice.setNoticeFields(fields));
    });

    res.status(200).json({
      edited: notice,
      message: "Notice updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating notice: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to update notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const closeNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

      if (notice.status !== "Closed") {
        //   const emailHandler = EmailHandler.getInstance();

        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.close());
      }
    });

    res.status(200).json({
      closed: notice,
      message: "Notice closed successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error closing notice: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to close notice.",
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
      notice = await transactionalEntityManager
        .getRepository(ProcessChangeNotice)
        .findOne({ where: { id } });

      if (!notice) {
        return res.status(404).json({
          message: "Notice not found",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

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

      if (notice.status === "Closed" && user.info.decisionMaker) {
        //   const emailHandler = EmailHandler.getInstance();

        notice = await transactionalEntityManager
          .getRepository(ProcessChangeNotice)
          .save(notice.assessByDepartment(department.id, assessment));
      }
    });

    res.status(200).json({
      assessed: notice,
      message: "Notices retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error assessing notice: ", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to assess notice.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNotices = async (_req: Request, res: Response) => {
  // try {
  //   const notices = await dataSource.getRepository(ProcessChangeNotice).find();

  //   res.status(200).json({
  //     got: notices,
  //     message: "Notices retrieved successfully",
  //     statusMessage: HttpResponseMessage.GET_SUCCESS,
  //   });
  // } catch (error) {
  //   console.error("Error retrieving notices: ", error);
  //   res.status(500).json({
  //     message: "Unknown error occurred. Failed to retrieve notices.",
  //     statusMessage: HttpResponseMessage.UNKNOWN,
  //   });
  // }

  try {
    const requests = await dataSource.getRepository(ProcessChangeRequest).find({
      relations: ["processChangeNotice"],
    });

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

export { editNotice, closeNotice, getNotices, assessNotice };
