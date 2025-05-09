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
import { CREATOR_DOCUMENTS_FOLDER, DOCUMENTS_FOLDER, UPLOADS_PATH } from "../config/routeConstants";
import * as path from "path";
import {
  postDraft,
  getDrafts,
  putDraft,
  deleteDraft,
  generateDraft,
  changeStatusOfDraft,
  checkRevision,
  downloadFiles,
  changeUploadedFiles,
} from "../controllers/document/creatorController";
import {
  getTotalUsage,
  getUsageLogs,
  postUsage,
} from "../controllers/document/msTranslatorUsageController";
import {
  deleteDraftCache,
  getDraftCache,
  getDraftCaches,
  upsertDraftCache,
} from "../controllers/document/creatorCacheController";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, DOCUMENTS_FOLDER) });

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

router.get("/creator/check-revision/:docId/:revision", checkRevision);
router.put("/creator/new/put/:id", creatorUpload.any(), putDraft);
router.put("/creator/change-status/:id/:status", creatorUpload.any(), changeStatusOfDraft);
router.put("/creator/change-uploaded-files/:id", creatorUpload.any(), changeUploadedFiles);
router.delete("/creator/delete/:id", deleteDraft);
router.post("/creator/get", upload.any(), getDrafts);
router.post("/creator/new/post", creatorUpload.any(), postDraft);
router.post("/creator/generate/:id/:language", generateDraft);
router.post("/creator/download-files/:id", upload.any(), downloadFiles);

router.get("/creator/ms-translator-usage/getUsageLogs", getUsageLogs);
router.get("/creator/ms-translator-usage/getTotalUsage", getTotalUsage);

router.post("/creator/ms-translator-usage/postUsage", postUsage);

router.post("/creator/cache", creatorUpload.any(), upsertDraftCache);
router.get("/creator/cache/:id", getDraftCache);
router.get("/creator/cache", getDraftCaches);
router.delete("/creator/cache/:id", deleteDraftCache);

export { router as documentRoutes };
