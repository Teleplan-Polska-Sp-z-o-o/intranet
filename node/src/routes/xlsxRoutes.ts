import express from "express";
import multer from "multer";
import { read } from "../controllers/xlsx/readXLSXController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/read", decodeFormData, read);

export { router as xlsxRoutes };
