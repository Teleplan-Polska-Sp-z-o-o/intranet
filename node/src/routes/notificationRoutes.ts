import express from "express";
import { editNotification, getNotifications } from "../controllers/common/notificationController";

const router = express.Router();

// Define routes

router.put("/:userId/:notificationId/:state", editNotification);
router.get("/:id/:state/:limit?", getNotifications);

export { router as notificationRoutes };
