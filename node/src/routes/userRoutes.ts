import {
  editUser,
  getUser,
  getUsers,
  getUsersByGroupAndSubgroup,
  removeUser,
  userAuth,
} from "../controllers/user/userController";
import { setSettingsLanguage, setSettingsTheme } from "../controllers/user/settingsController";

import { refreshToken, verifyToken } from "../controllers/user/tokenController";

import express from "express";
import multer from "multer";
import { getLoginDetails } from "../controllers/user/userLoginDetailsController";
import { addOrUpdateToolUsage, getToolUsage } from "../controllers/user/toolStatisticsController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.get("/login-details", getLoginDetails);
router.get("/one/:username", getUser);
router.get("/all/:equalOrAbovePermission?", getUsers);
router.get("/group-subgroup/:group/:subgroup?", getUsersByGroupAndSubgroup);
router.post("/auth", userAuth);
router.delete("/:id", removeUser);

router.put("/settings/theme", setSettingsTheme);
router.put("/settings/language", setSettingsLanguage);

router.put("/", decodeFormData, editUser);

router.post("/token/verify", verifyToken);
router.post("/token/refresh", refreshToken);

router.get("/statistics/usage", getToolUsage);
router.post("/statistics/usage/:toolName", addOrUpdateToolUsage);

export { router as userRoutes };
