import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { User as UserEntity } from "../../orm/entity/user/UserEntity";
import { User } from "../../models/user/User";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { UserSettings } from "../../orm/entity/user/UserSettingsEntity";
import { adminsConfig } from "../../config/admins";
import { HttpResponseMessage } from "../../enums/response";

const findUser = async (username: string): Promise<UserEntity> => {
  return dataSource.getRepository(UserEntity).findOne({
    where: { username },
    relations: ["permission", "settings"],
  });
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user: UserEntity = await findUser(req.body.username);

    if (!user)
      res
        .status(404)
        .json({ user, message: "User not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    res
      .status(200)
      .json({ user, message: "User found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to retrieve user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const { equalOrAbovePermission } = req.params;

    let queryBuilder = dataSource
      .getRepository(UserEntity)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.permission", "permission")
      .leftJoinAndSelect("user.settings", "settings");

    if (equalOrAbovePermission) {
      switch (equalOrAbovePermission) {
        case "moderator":
          queryBuilder = queryBuilder.andWhere("permission.write = :write", { write: true });
          break;

        case "admin":
          queryBuilder = queryBuilder.andWhere("permission.control = :control", { control: true });
          break;
      }
    }

    const users: Array<UserEntity> = await queryBuilder.getMany();

    // const users: Array<UserEntity> = await dataSource
    //   .getRepository(UserEntity)
    //   .find({ relations: ["permission", "settings"] });

    if (!users)
      res
        .status(404)
        .json({ users, message: "Users not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    res
      .status(200)
      .json({ users, message: "Users found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to retrieve user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const userAuth = async (req: Request, res: Response) => {
  try {
    let user = new User(req.body);

    user.username.toLocaleLowerCase();

    // Wait for LDAP authentication to complete
    const authenticated = await user.ldapAuthenticate();

    if (!authenticated)
      res.status(204).json({
        message: "Invalid username or password.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });

    // Check if user exist in database
    let userExist: UserEntity | null = null;

    userExist = await findUser(user.username);

    // Create new UserEntity if user doesn't exist in database
    if (!userExist) {
      const admins = adminsConfig.admins;
      const adminPermission = {
        read: true,
        write: true,
        control: true,
      };

      const permissionEntity: UserPermission = admins.includes(user.username)
        ? new UserPermission(adminPermission)
        : new UserPermission();

      const permission = await dataSource.getRepository(UserPermission).save(permissionEntity);

      const settings = await dataSource.getRepository(UserSettings).save(new UserSettings());

      await dataSource
        .getRepository(UserEntity)
        .save(new UserEntity(user.username, user.domain, permission, settings));

      userExist = await findUser(user.username);

      res.status(201).json({
        userExist,
        message: "Authentication successful. User has been created.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    } else {
      res.status(200).json({
        userExist,
        message: "Authentication successful.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    }
  } catch (err) {
    console.error("Error authenticating user: ", err);
    res.status(500).json({
      message: "Unknown error occurred. Failed to authenticate user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const userToRemove = await transactionalEntityManager
        .getRepository(UserEntity)
        .findOne({ where: { id } });

      if (!userToRemove) {
        return res.status(404).json({
          message: "User not found.",
          statusMessage: HttpResponseMessage.DELETE_ERROR,
        });
      }

      const removedUser = await transactionalEntityManager
        .getRepository(UserEntity)
        .remove(userToRemove);

      res.status(200).json({
        deleted: removedUser,
        message: "User removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to remove user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getUser, getUsers, userAuth, removeUser };
