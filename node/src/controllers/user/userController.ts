import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { User, User as UserEntity } from "../../orm/entity/user/UserEntity";
import { LDAP } from "../../models/user/LDAP";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { UserSettings } from "../../orm/entity/user/UserSettingsEntity";
import { adminsConfig } from "../../config/admins";
import { HttpResponseMessage } from "../../enums/response";
import { UserInfo } from "../../orm/entity/user/UserInfoEntity";
import { PermissionGroups, StaticGroups } from "../../interfaces/user/UserTypes";
import { UserInformation } from "../../models/user/UserInformation";
import { DataSource, EntityManager } from "typeorm";
import { helperSetPermissionGroups } from "./permissionController";
// import { Permission } from "../../models/user/Permission";

const findUser = async (
  where: string | number,
  entityManager: DataSource | EntityManager = dataSource
): Promise<UserEntity> => {
  const whereOptions = typeof where === "number" ? { id: where } : { username: where };
  return entityManager.getRepository(UserEntity).findOne({
    where: whereOptions,
    relations: [
      "permission",
      "settings",
      "info",
      "permission.groups",
      "permission.groups.subgroups",
    ],
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

    return res
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
      .leftJoinAndSelect("user.info", "info")
      .leftJoinAndSelect("permission.groups", "groups")
      .leftJoinAndSelect("groups.subgroups", "subgroups");

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
      return res
        .status(404)
        .json({ users, message: "Users not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    return res
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

const createUser = async (
  groups: Partial<PermissionGroups> | PermissionGroups,
  ldap: LDAP,
  entityManager: EntityManager
): Promise<User> => {
  const permission = await entityManager.getRepository(UserPermission).save(new UserPermission());

  await helperSetPermissionGroups(groups, permission, entityManager);

  const settings = await entityManager.getRepository(UserSettings).save(new UserSettings());

  const info = await entityManager

    .getRepository(UserInfo)
    .save(new UserInfo().build(new UserInformation()));

  return await entityManager
    .getRepository(UserEntity)
    .save(new UserEntity(ldap.username, ldap.domain, permission, settings, info));
};

const userAuth = async (req: Request, res: Response) => {
  try {
    let ldap = new LDAP(req.body);
    ldap = await ldap.auth();

    const admins = adminsConfig.admins;
    const isAdmin = admins.includes(ldap.username);

    let groups: Partial<PermissionGroups>;
    if (isAdmin) groups = StaticGroups.getAdminGroups();
    else groups = StaticGroups.getBaseUserGroups();

    await dataSource.transaction(async (transactionalEntityManager) => {
      // Check if user exist in database
      let userExist: UserEntity | null = null;
      userExist = await findUser(ldap.username, transactionalEntityManager);

      // Create new UserEntity if user doesn't exist in database
      if (!userExist) {
        userExist = await createUser(groups, ldap, transactionalEntityManager);

        return res.status(201).json({
          userExist,
          message: "Authentication successful. User has been created.",
          statusMessage: HttpResponseMessage.POST_SUCCESS,
        });
      } else {
        const hasTruthyValue = Object.values(userExist.info).some((value) => Boolean(value));
        if (!userExist.info || !hasTruthyValue) {
          const info = await transactionalEntityManager
            .getRepository(UserInfo)
            .save(new UserInfo().build(new UserInformation()));
          userExist.info = info;
          await transactionalEntityManager.getRepository(UserEntity).save(userExist);
        }

        const userPermission: UserPermission = userExist.permission;
        if (!Array.isArray(userPermission.groups) || userPermission.groups.length === 0) {
          await helperSetPermissionGroups(groups, userPermission, transactionalEntityManager);
        }
      }

      const token = ldap.generateJwt(userExist);

      return res.status(200).json({
        userExist,
        token,
        message: "Authentication successful.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (err) {
    console.error(`Error authenticating user: ${JSON.stringify(req.body)}, error: ${err}`);
    if (err.name === "InvalidCredentialsError") {
      return res.status(401).json({
        message: "Invalid username or password.",
        statusMessage: HttpResponseMessage.AUTH_INVALID_CREDENTIALS,
      });
    }

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
    const info: UserInformation = JSON.parse(body.info);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const user: UserEntity = await findUser(userId, transactionalEntityManager);
      const userInfo: UserInfo = user.info;
      if (!userInfo)
        return res.status(404).json({
          message: "User info not found.",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });

      userInfo.build(new UserInformation(info));
      await transactionalEntityManager.getRepository(UserInfo).save(userInfo);

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
        .findOne({ where: { id: Number(id) } });

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

const getUsersByGroupAndSubgroup = async (req: Request, res: Response) => {
  try {
    const { group, subgroup } = req.params;

    let queryBuilder = dataSource
      .getRepository(UserEntity)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.permission", "permission")
      .leftJoinAndSelect("user.settings", "settings")
      .leftJoinAndSelect("user.info", "info")
      .leftJoinAndSelect("permission.groups", "groups")
      .leftJoinAndSelect("groups.subgroups", "subgroups")
      .where("groups.name = :group", { group });

    if (subgroup) queryBuilder = queryBuilder.andWhere("subgroups.name = :subgroup", { subgroup });

    const users: Array<UserEntity> = await queryBuilder.getMany();

    if (!users)
      return res
        .status(404)
        .json({ users, message: "Users not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    return res
      .status(200)
      .json({ users, message: "Users found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving users:", err);
    return res.status(500).json({
      err,
      message: "Unknown error occurred. Failed to retrieve users.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getUser, getUsers, userAuth, editUser, removeUser, getUsersByGroupAndSubgroup };
