import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { User } from "../../orm/entity/user/UserEntity";
import { IPermission } from "../../interfaces/user/IPermission";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { IUser } from "../../interfaces/user/IUser";
import { HttpResponseMessage } from "../../enums/response";

const findUser = async (user: IUser): Promise<User> => {
  return dataSource.getRepository(User).findOne({
    where: { id: user.id, username: user.username, domain: user.domain },
    relations: ["permission", "settings"],
  });
};

const editPermission = async (req: Request, res: Response) => {
  try {
    const { user, permission }: { user: IUser; permission: IPermission } = req.body;

    const userEntity: User = await findUser(user);

    if (!userEntity) {
      return res.status(404).json({
        message: "User not found.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    const newPermission: UserPermission = new UserPermission(permission);

    const userPermission = await dataSource.getRepository(UserPermission).findOne({
      where: { id: user.id },
    });

    userPermission.write = newPermission.write;
    userPermission.control = newPermission.control;

    await dataSource.getRepository(UserPermission).save(userPermission);

    res.status(200).json({
      edited: newPermission,
      message: "Permission updated successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error setting permission:", error);
    res.status(500).json({
      message: "Unknown error occurred. Failed to update subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { editPermission };
