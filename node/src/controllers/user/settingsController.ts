import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { Settings } from "../../models/user/Settings";
import { User } from "../../orm/entity/user/UserEntity";
import { UserSettings } from "../../orm/entity/user/UserSettingsEntity";
import { Permission } from "../../models/user/Permission";
import { IPermission } from "../../interfaces/user/IPermission";
import { UserPermission } from "../../orm/entity/user/UserPermissionEntity";
import { IUser } from "../../interfaces/user/IUser";
import { HttpResponseMessage } from "../../enums/response";

const findUser = async (id: number): Promise<User> => {
  return dataSource.getRepository(User).findOne({
    where: { id },
    relations: ["settings"],
  });
};

const setSettingsTheme = async (req: Request, res: Response) => {
  try {
    const settings = new Settings(req.body);

    const user = await findUser(settings.id);

    if (!user)
      return res.status(404).json({
        message: "User settings not found.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });

    const userSettings = user.settings;

    if (!userSettings) {
      return res.status(404).json({
        message: "User settings not found.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    userSettings.theme = settings.theme;

    await dataSource.getRepository(UserSettings).save(userSettings);

    return res.status(200).json({
      message: "Theme updated successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error setting theme:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update theme.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const setSettingsLanguage = async (req: Request, res: Response) => {
  try {
    const settings = new Settings(req.body);

    const user = await findUser(settings.id);

    if (!user)
      return res.status(404).json({
        message: "User settings not found.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });

    const userSettings = user.settings;

    if (!userSettings)
      return res.status(404).json({
        message: "User settings not found.",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });

    userSettings.language = settings.language;

    await dataSource.getRepository(UserSettings).save(userSettings);

    return res.status(200).json({
      message: "Language updated successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error setting theme:", error);
    return res.status(500).json({
      message: "Unknown error occurred. Failed to update language.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const setSettingsPermission = async (req: Request, res: Response) => {
  // try {
  //   const { privilegeKey, user }: { privilegeKey: string; user: IUser } = req.body;
  //   let permission: IPermission;
  //   const moderatorPermission = {
  //     read: true,
  //     write: true,
  //     control: false,
  //   };
  //   const permissionEntity = new UserPermissionEntity(permission);
  //   const userEntity = await findUser(user.id);
  //   if (!userEntity) return res.status(404).json({ message: "User permission not found." });
  //   permissionEntity.id = userEntity.id;
  //   const userPermission = permissionEntity;
  //   await dataSource.getRepository(UserPermissionEntity).save(userPermission);
  //   return res.status(200).json({ message: "Permission updated successfully." });
  // } catch (error) {
  //   console.error("Error setting permission:", error);
  //   return res
  //     .status(404)
  //     .json({ message: "Unknown error occurred. Failed to update permission." });
  // }
};

export { setSettingsTheme, setSettingsLanguage };
