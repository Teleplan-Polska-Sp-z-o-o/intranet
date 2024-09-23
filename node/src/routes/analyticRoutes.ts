import express from "express";
import multer from "multer";
import { getRawTransactions } from "../sideControllers/TransactionsRawController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/raw", decodeFormData, getRawTransactions);

export { router as analyticRoutes };
