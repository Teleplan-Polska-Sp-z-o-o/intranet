import express from "express";
import multer from "multer";

import {
  addDocument,
  editDocument,
  getDocumentByUuidAndLangs,
  getDocuments,
  getDocumentsByDep,
  getDocumentsByDepCat,
  getDocumentsByDepCatSub,
  getDocumentsByNumber,
  removeDocument,
} from "../controllers/document/documentController";
import { DOCUMENTS_FOLDER, UPLOADS_PATH } from "../config/routeConstants";
import * as path from "path";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, DOCUMENTS_FOLDER) });
// Define routes

router.post("/", upload.any(), addDocument);
router.put("/", upload.any(), editDocument);
router.delete("/:id", removeDocument);
router.get("/uuidLangs/:uuid/:langs", getDocumentByUuidAndLangs);
router.get("/:type/:reduce/:confidentiality", getDocuments);
router.get("/by/:number", getDocumentsByNumber);
router.get("/by/:departmentName/:type/:reduce/:confidentiality", getDocumentsByDep);
router.get(
  "/by/:departmentName/:categoryName/:type/:reduce/:confidentiality",
  getDocumentsByDepCat
);
router.get(
  "/by/:departmentName/:categoryName/:subcategoryName/:type/:reduce/:confidentiality",
  getDocumentsByDepCatSub
);

export { router as documentRoutes };
