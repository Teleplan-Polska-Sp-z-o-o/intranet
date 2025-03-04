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
import {
  postDraft,
  getDrafts,
  putDraft,
  deleteDraft,
  generateDraft,
} from "../controllers/document/creatorController";
import {
  getTotalUsage,
  getUsageLogs,
  postUsage,
} from "../controllers/document/msTranslatorUsageController";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, DOCUMENTS_FOLDER) });
// const decodeFormData = multer().none();
const creatorUpload = multer({
  limits: {
    fieldSize: 10 * 1024 * 1024, // Increase the limit to 10MB
  },
});
// Define routes

router.post("/", upload.any(), addDocument);
router.put("/", upload.any(), editDocument);
router.put("/toggle-quick/:id", toggleQuickAccess);
router.delete("/:id", removeDocument);
router.get("/by/:number", getDocumentsByNumber);
router.get("/by/:uuid/:langs", getDocumentByUuidAndLangs);
router.get("/by/:folderStructure/:type/:reduce/:confidentiality/:quickAccess", getDocuments);

router.post("/creator/new/post", creatorUpload.any(), postDraft);
router.put("/creator/new/put/:id", creatorUpload.any(), putDraft);
router.get("/creator/get", getDrafts);
router.delete("/creator/delete/:id", deleteDraft);
router.post("/creator/generate/:id/:language", generateDraft);

router.get("/creator/ms-translator-usage/getUsageLogs", getUsageLogs);
router.get("/creator/ms-translator-usage/getTotalUsage", getTotalUsage);

router.post("/creator/ms-translator-usage/postUsage", postUsage);

export { router as documentRoutes };
