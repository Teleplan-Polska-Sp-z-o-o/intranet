import express from "express";
import multer from "multer";

import { ANALYTIC_DOCUMENTS_FOLDER, UPLOADS_PATH } from "../config/routeConstants";
import * as path from "path";
import {
  deleteAnalyticFile,
  getAnalyticFileById,
  getAnalyticFiles,
  getByProgAndCatAndSub,
  postAnalyticFile,
  putAnalyticFile,
  restoreAnalyticFile,
} from "../controllers/analytic/AnalyticFileController";

const router = express.Router();
const upload = multer({ dest: path.join(UPLOADS_PATH, ANALYTIC_DOCUMENTS_FOLDER) });

// Define routes
router.post("", upload.any(), postAnalyticFile);
router.put("/restore/:id", upload.none(), restoreAnalyticFile);
router.put("", upload.any(), putAnalyticFile);
router.get("", getAnalyticFiles);
router.get("/by/:progName/:catName/:subName", getByProgAndCatAndSub);
router.get("/by/:id", getAnalyticFileById);
router.delete("/:id", deleteAnalyticFile);

export { router as analyticFileRoutes };
