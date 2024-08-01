import express from "express";
import multer from "multer";
import {
  addDCR,
  assessDCR,
  registration,
  editDCR,
  getUnregisteredDCRs,
  getRegisteredDCRs,
  removeDCR,
} from "../controllers/change/document/documentChangeController";
import { DOCX_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../config/routeConstants";
import * as path from "path";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, DOCX_DOCUMENTS_FOLDER) });

// Define routes for Document Change Requests
router.post("", upload.any(), addDCR);
router.put("", upload.any(), editDCR);
router.put("/assess", upload.none(), assessDCR);
router.put("/registration/:id/:registered", registration);
router.delete("/:id", removeDCR);
router.get("/unregistered", getUnregisteredDCRs);
router.get("/registered", getRegisteredDCRs);

export { router as documentChangeRoutes };
