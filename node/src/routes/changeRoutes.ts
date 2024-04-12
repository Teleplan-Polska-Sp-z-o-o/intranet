import {
  addRequest,
  editRequest,
  closeRequest,
  removeRequest,
  getRequests,
} from "../controllers/change/requestController";

import express from "express";
import multer from "multer";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/request", decodeFormData, addRequest);
router.put("/request", decodeFormData, editRequest);
router.put("/request/:id/:assessment", decodeFormData, closeRequest);
router.delete("/request/:id", removeRequest);
router.get("/request", getRequests);

export { router as changeRoutes };
