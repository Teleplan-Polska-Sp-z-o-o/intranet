import { editPermission, getPermission } from "../controllers/user/permissionController";

import express from "express";
import multer from "multer";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes

router.put("", decodeFormData, editPermission);
router.get("/:iUserJson", decodeFormData, getPermission);

export { router as permissionRoutes };
