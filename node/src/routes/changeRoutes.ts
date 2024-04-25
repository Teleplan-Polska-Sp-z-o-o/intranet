import {
  addRequest,
  editRequest,
  closeRequest,
  removeRequest,
  getRequests,
  getRequest,
} from "../controllers/change/requestController";

import { getRequestUpdates } from "../controllers/change/requestUpdatesController";

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

export { router as changeRoutes };
