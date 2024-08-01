import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { User } from "../../orm/entity/user/UserEntity";
import { PermissionGroups, TConfidentiality } from "../../interfaces/user/UserTypes";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { IUser } from "../../interfaces/user/UserTypes";
import { HttpResponseMessage } from "../../enums/response";
import { EntityManager } from "typeorm";
import { UserGroup } from "../../orm/entity/user/UserGroupEntity";
import { UserSubgroup } from "../../orm/entity/user/UserSubgroupEntity";

const findUser = async (user: IUser, em: EntityManager): Promise<User> => {
  return em.getRepository(User).findOne({
    where: { id: user.id, username: user.username, domain: user.domain },
    relations: ["permission", "permission.groups", "permission.groups.subgroups"],
  });
};

const helperSetPermissionGroups = async (
  groups: Partial<PermissionGroups>,
  permissionEntity: UserPermission,
  em: EntityManager
) => {
  try {
    // Step 1: Retrieve existing groups and subgroups
    const existingGroups = permissionEntity.groups || [];

    // Step 2: Determine groups and subgroups to delete
    const newGroupNames = Object.keys(groups);
    const newSubGroupNames = newGroupNames.flatMap((group) => groups[group]);

    for (const group of existingGroups) {
      // Delete subgroups that are not in the newSubGroupNames
      const subGroupsToDelete = group.subgroups.filter(
        (subGroup) => !newSubGroupNames.includes(subGroup.name)
      );
      if (subGroupsToDelete.length > 0) {
        await em.getRepository(UserSubgroup).remove(subGroupsToDelete);
      }

      // Delete the group if it's not in the newGroupNames
      if (!newGroupNames.includes(group.name)) {
        await em.getRepository(UserGroup).remove(group);
      }
    }

    // Step 3: Add new groups and subgroups
    for (const [groupName, subGroups] of Object.entries(groups)) {
      // Check if the group already exists
      let groupEntity = existingGroups.find((group) => group.name === groupName);
      if (!groupEntity) {
        groupEntity = new UserGroup().build(groupName, permissionEntity);
        await em.getRepository(UserGroup).save(groupEntity);

        groupEntity.subgroups = [];
      }

      if (!groupEntity.subgroups) {
        groupEntity.subgroups = [];
      }
      // Add subgroups
      for (const subGroupName of subGroups) {
        let subGroupEntity = groupEntity.subgroups.find(
          (subGroup) => subGroup.name === subGroupName
        );
        if (!subGroupEntity) {
          subGroupEntity = new UserSubgroup().build(subGroupName, groupEntity);
          await em.getRepository(UserSubgroup).save(subGroupEntity);
        }
      }
    }
  } catch (error) {
    console.log(`helperSetPermissionGroups at permissionController, ${error}`);
  }
};

const getPermission = async (req: Request, res: Response) => {
  try {
    const { iUserJson } = req.params;
    const user: IUser = JSON.parse(iUserJson);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const userEntity: User = await findUser(user, transactionalEntityManager);
      if (!userEntity) {
        return res.status(404).json({
          message: "User not found.",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }
      return res.status(200).json({
        user: userEntity,
        message: "Permission updated successfully.",
        statusMessage: HttpResponseMessage.PUT_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error setting permission:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editPermission = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user: IUser = JSON.parse(body.user);
    const confidentiality: TConfidentiality = JSON.parse(body.confidentiality);
    const groups: Partial<PermissionGroups> = JSON.parse(body.groups);

    let userPermission: UserPermission;
    await dataSource.transaction(async (transactionalEntityManager) => {
      const userEntity: User = await findUser(user, transactionalEntityManager);
      if (!userEntity) {
        return res.status(404).json({
          message: "User not found.",
          statusMessage: HttpResponseMessage.PUT_ERROR,
        });
      }

      const userPermission = userEntity.permission.setConfidentiality(confidentiality);

      await transactionalEntityManager.getRepository(UserPermission).save(userPermission);
      await helperSetPermissionGroups(groups, userPermission, transactionalEntityManager);
    });

    return res.status(200).json({
      edited: userPermission,
      message: "Permission updated successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error setting permission:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { helperSetPermissionGroups, getPermission, editPermission };
