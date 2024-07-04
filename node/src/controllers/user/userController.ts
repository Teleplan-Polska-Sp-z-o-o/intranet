import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { User as UserEntity } from "../../orm/entity/user/UserEntity";
import { LDAP } from "../../models/user/LDAP";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { UserSettings } from "../../orm/entity/user/UserSettingsEntity";
import { adminsConfig } from "../../config/admins";
import { HttpResponseMessage } from "../../enums/response";
import { UserInfo } from "../../orm/entity/user/UserInfoEntity";
import { IPermission } from "../../interfaces/user/IPermission";
import { UserInformation } from "../../models/user/UserInformation";
import { DataSource, EntityManager } from "typeorm";
import { TConfidentiality } from "../../interfaces/user/TConfidentiality";

const findUser = async (
  where: string | number,
  entityManager: DataSource | EntityManager = dataSource
): Promise<UserEntity> => {
  const whereOptions = typeof where === "number" ? { id: where } : { username: where };
  return entityManager.getRepository(UserEntity).findOne({
    where: whereOptions,
    relations: ["permission", "settings", "info"],
  });
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user: UserEntity = await findUser(username);

    if (!user)
      return res
        .status(404)
        .json({ user, message: "User not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    res
      .status(200)
      .json({ user, message: "User found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res.status(500).json({
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
      .leftJoinAndSelect("user.settings", "settings")
      .leftJoinAndSelect("user.info", "info");

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
    return res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to retrieve user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const userAuth = async (req: Request, res: Response) => {
  try {
    let ldap = new LDAP(req.body);

    ldap.username.toLowerCase();

    const ldapUser = await ldap.authenticate();
    if (!ldapUser)
      return res.status(204).json({
        message: "Invalid username or password.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });

    const token = ldap.generateJwt(ldapUser);

    // Check if user exist in database
    let userExist: UserEntity | null = null;

    userExist = await findUser(ldap.username);

    // Create new UserEntity if user doesn't exist in database
    if (!userExist) {
      const admins = adminsConfig.admins;
      const adminPermission = {
        read: true,
        write: true,
        control: true,
      };

      const permissionEntity: UserPermission = admins.includes(ldap.username)
        ? new UserPermission(adminPermission)
        : new UserPermission();

      const permission = await dataSource.getRepository(UserPermission).save(permissionEntity);

      const settings = await dataSource.getRepository(UserSettings).save(new UserSettings());

      const info = await dataSource
        .getRepository(UserInfo)
        .save(new UserInfo().build(new UserInformation(), ldapUser));

      await dataSource
        .getRepository(UserEntity)
        .save(new UserEntity(ldap.username, ldap.domain, permission, settings, info));

      userExist = await findUser(ldap.username);

      return res.status(201).json({
        userExist,
        message: "Authentication successful. User has been created.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    } else {
      if (!userExist.info || !Object.values(userExist.info).some((value) => Boolean(value))) {
        const info = await dataSource
          .getRepository(UserInfo)
          .save(new UserInfo().build(new UserInformation(), ldapUser));
        userExist.info = info;
        await dataSource.getRepository(UserEntity).save(userExist);
      }

      if (!userExist.info.LDAPObject) {
        let info = await dataSource
          .getRepository(UserInfo)
          .findOne({ where: { id: userExist.id } });
        info = await dataSource
          .getRepository(UserInfo)
          .save(info.sanitizeAndAssignLDAPObject(ldapUser));
        await dataSource.getRepository(UserEntity).save((userExist.info = info));
      }

      return res.status(200).json({
        userExist,
        token,
        message: "Authentication successful.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    }
  } catch (err) {
    console.error(`Error authenticating user: ${req.body}`, err);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to authenticate user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userId: number = JSON.parse(body.user).id;
    const permission: IPermission = JSON.parse(body.permission);
    const info: UserInformation = JSON.parse(body.info);
    const confidentiality: TConfidentiality | undefined = JSON.parse(body?.confidentiality);

    let user: UserEntity;

    await dataSource.transaction(async (transactionalEntityManager) => {
      if (permission) {
        const newPermission: UserPermission = confidentiality
          ? new UserPermission(permission, confidentiality)
          : new UserPermission(permission);

        const userPermission = await transactionalEntityManager
          .getRepository(UserPermission)
          .findOne({
            where: { id: userId },
          });

        userPermission.write = newPermission.write;
        userPermission.control = newPermission.control;
        userPermission.confidentiality = newPermission.confidentiality;

        await transactionalEntityManager.getRepository(UserPermission).save(userPermission);
      }

      const userInfo: UserInfo = (await findUser(userId, transactionalEntityManager)).info;

      if (userInfo) {
        userInfo.build(new UserInformation(info));
        await transactionalEntityManager.getRepository(UserInfo).save(userInfo);
      } else {
        const userInfoRecord = await transactionalEntityManager
          .getRepository(UserInfo)
          .save(new UserInfo().build(new UserInformation()));
        user.info = userInfoRecord;
        await transactionalEntityManager.getRepository(UserEntity).save(user);

        userInfo.build(new UserInformation(info));
        const userInfoExist = await transactionalEntityManager
          .getRepository(UserInfo)
          .save(userInfo);

        if (!userInfoExist)
          return res.status(404).json({
            message: "User info not found.",
            statusMessage: HttpResponseMessage.PUT_ERROR,
          });
      }

      user = await findUser(userId, transactionalEntityManager);

      return res.status(200).json({
        edited: user,
        message: "Request updated successfully",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (err) {
    console.error("Error editing user:", err);
    return res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to remove user.",
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

      return res.status(200).json({
        deleted: removedUser,
        message: "User removed successfully",
        statusMessage: HttpResponseMessage.DELETE_SUCCESS,
      });
    });
  } catch (err) {
    console.error("Error removing user:", err);
    return res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to remove user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getUser, getUsers, userAuth, editUser, removeUser };
