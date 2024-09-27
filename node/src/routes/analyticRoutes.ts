import express from "express";
import multer from "multer";
import {
  getRawPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
} from "../sideControllers/TransactionsRawController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/raw/packing", decodeFormData, getRawPackingTransactions);
router.post("/raw/cosmetic", decodeFormData, getRawCosmeticTransactions);
router.post("/raw/ooba", decodeFormData, getRawOobaTransactions);

export { router as analyticRoutes };
