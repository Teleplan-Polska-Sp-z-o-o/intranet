import express from "express";
import multer from "multer";
import {
  getRawPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
} from "../sideControllers/sky/TransactionsRawController";
import { getRawRepairTransactions } from "../sideControllers/lenovo/TransactionsRawController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes

//sky
router.post("/raw/sky/packing", decodeFormData, getRawPackingTransactions);
router.post("/raw/sky/cosmetic", decodeFormData, getRawCosmeticTransactions);
router.post("/raw/sky/ooba", decodeFormData, getRawOobaTransactions);

// lenovo
router.post("/raw/lenovo/repair", decodeFormData, getRawRepairTransactions);

export { router as analyticRoutes };
