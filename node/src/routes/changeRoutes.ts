import {
  addRequest,
  editRequest,
  closeRequest,
  removeRequest,
  getRequests,
  getRequest,
} from "../controllers/change/requestController";

import { getRequestUpdates } from "../controllers/change/requestUpdatesController";

import {
  editNotice,
  getNotice,
  getNotices,
  assessNotice,
} from "../controllers/change/noticeController";

import { getNoticeUpdates } from "../controllers/change/noticeUpdatesController";

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
router.put("/notice/:assessment", decodeFormData, assessNotice);

router.get("/notice/:id", getNotice);
router.get("/notice", getNotices);
router.get("/notice/updates/:id", getNoticeUpdates);

export { router as changeRoutes };
