import {
  editUser,
  getUser,
  getUsers,
  removeUser,
  userAuth,
} from "../controllers/user/userController";
import { setSettingsLanguage, setSettingsTheme } from "../controllers/user/settingsController";
import { editPermission } from "../controllers/user/permissionController";

import express from "express";
import multer from "multer";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.get("/one", getUser);
router.get("/all/:equalOrAbovePermission?", getUsers);
router.post("/auth", userAuth);
router.delete("/:id", removeUser);

router.put("/settings/theme", setSettingsTheme);
router.put("/settings/language", setSettingsLanguage);

router.put("/permission", decodeFormData, editPermission);

router.put("/", decodeFormData, editUser);

export { router as userRoutes };
