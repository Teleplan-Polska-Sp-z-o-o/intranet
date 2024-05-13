import {
  addRequest,
  editRequest,
  closeRequest,
  removeRequest,
  getRequests,
  getRequest,
} from "../controllers/change/requestController";

import { getRequestUpdates } from "../controllers/change/requestUpdatesController";

import { editNotice, closeNotice, getNotices } from "../controllers/change/noticeController";

import express from "express";
import multer from "multer";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/request", decodeFormData, addRequest);
router.put("/request", decodeFormData, editRequest);
router.put("/request/:assessment", decodeFormData, closeRequest);
router.delete("/request/:id", removeRequest);
router.get("/request/:id", getRequest);
router.get("/request", getRequests);

router.get("/request/updates/:id", getRequestUpdates);

router.put("/notice", decodeFormData, editNotice);
router.put("/notice/close/:id", closeNotice);
router.put("/notice/:assessment", decodeFormData, closeNotice);
router.get("/notice", getNotices);

export { router as changeRoutes };
