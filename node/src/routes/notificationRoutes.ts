import express from "express";
import {
  editNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/common/notificationController";

const router = express.Router();

// Define routes

router.put("/:userId/:notificationId/:state", editNotification);
router.get("/:id/:state/:limit?", getNotifications);
router.delete("/:id", deleteNotification);

export { router as notificationRoutes };
