import express from "express";
import multer from "multer";

import {
  addDocument,
  editDocument,
  getDocumentByUuidAndLangs,
  getDocuments,
  getDocumentsByNumber,
  removeDocument,
  toggleQuickAccess,
} from "../controllers/document/documentController";
import { DOCUMENTS_FOLDER, UPLOADS_PATH } from "../config/routeConstants";
import * as path from "path";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, DOCUMENTS_FOLDER) });
// Define routes

router.post("/", upload.any(), addDocument);
router.put("/", upload.any(), editDocument);
router.put("/toggle-quick/:id", toggleQuickAccess);
router.delete("/:id", removeDocument);
router.get("/by/:number", getDocumentsByNumber);
router.get("/by/:uuid/:langs", getDocumentByUuidAndLangs);
router.get("/by/:folderStructure/:type/:reduce/:confidentiality/:quickAccess", getDocuments);

export { router as documentRoutes };
