import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { UserNotification } from "../../orm/entity/user/UserNotificationEntity";
import { User } from "../../orm/entity/user/UserEntity";
import { HttpResponseMessage } from "../../enums/response";
import { INotificationsOptions } from "../../interfaces/user/notification/INotificationsOptions";

const saveNotification = async (notification: UserNotification) => {
  try {
    await dataSource.getRepository(UserNotification).save(notification);
  } catch (error) {
    console.error("Error adding request: ", error);
  }
};

const editNotification = async (
  req: Request<{ userId: number; notificationId: number; state: string }>,
  res: Response
) => {
  try {
    const { userId, notificationId, state } = req.params;

    let updatedNotification: UserNotification;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const userOptions = {
        where: {
          id: userId,
        },
      };
      const userEntity = await transactionalEntityManager.getRepository(User).findOne(userOptions);

      const updatedNotificationOptions = {
        where: {
          id: notificationId,
          user: userEntity,
        },
      };

      updatedNotification = await transactionalEntityManager
        .getRepository(UserNotification)
        .findOne(updatedNotificationOptions);

      updatedNotification.state = state;

      updatedNotification = await transactionalEntityManager
        .getRepository(UserNotification)
        .save(updatedNotification);
    });

    return res.status(200).json({
      edited: updatedNotification,
      message: "Notification updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error editing notifications: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve notifications.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNotifications = async (
  req: Request<{ id: number; limit: number | "undefined"; state: string }>,
  res: Response
) => {
  try {
    const { id, limit, state } = req.params;

    let notifications: Array<UserNotification> = [];
    await dataSource.transaction(async (transactionalEntityManager) => {
      const userOptions = {
        where: {
          id,
        },
      };
      const userEntity = await transactionalEntityManager.getRepository(User).findOne(userOptions);

      let notificationsOptions: Partial<INotificationsOptions> = {
        where: {
          user: userEntity,
        },
        order: {
          id: "DESC" as "DESC",
        },
      };
      if (limit !== "undefined")
        notificationsOptions = {
          ...notificationsOptions,
          take: limit,
        };

      if (state !== "all")
        notificationsOptions = {
          ...notificationsOptions,
          where: {
            ...notificationsOptions.where,
            state: state,
          },
        };

      notifications = await transactionalEntityManager
        .getRepository(UserNotification)
        .find(notificationsOptions);
    });

    return res.status(200).json({
      got: notifications,
      message: "Notifications retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving notifications: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to retrieve notifications.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const deleteNotification = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const deleteNotificationOptions = {
        where: {
          id,
        },
      };

      const notification = await transactionalEntityManager
        .getRepository(UserNotification)
        .findOne(deleteNotificationOptions);

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      const deleted = await transactionalEntityManager
        .getRepository(UserNotification)
        .remove(notification);

      return res.status(200).json({
        deleted,
        message: "Notification deleted successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error deleting notification: ", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to delete notification.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { saveNotification, editNotification, getNotifications, deleteNotification };
