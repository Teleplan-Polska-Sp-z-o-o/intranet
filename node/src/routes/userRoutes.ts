import express from "express";
import { getUser, getUsers, userAuth } from "../controllers/user/userController";
import { setSettingsLanguage, setSettingsTheme } from "../controllers/user/settingsController";
import { editPermission } from "../controllers/user/permissionController";

const router = express.Router();

// Define routes
router.get("/one", getUser);
router.get("/all/:equalOrAbovePermission?", getUsers);
router.post("/auth", userAuth);

router.put("/settings/theme", setSettingsTheme);
router.put("/settings/language", setSettingsLanguage);

router.put("/permission", editPermission);

export { router as userRoutes };
