import express from "express";
import multer from "multer";
import {
  getRawSkyPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
} from "../sideControllers/sky/TransactionsRawController";
import {
  getRawRegistrationTransactions,
  getRawCleaningTransactions,
  getRawFinalTestTransactions,
  getRawLenovoPackingTransactions,
  getRawRepairTransactions,
} from "../sideControllers/lenovo/TransactionsRawController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes

//sky
router.post("/raw/sky/packing", decodeFormData, getRawSkyPackingTransactions);
router.post("/raw/sky/cosmetic", decodeFormData, getRawCosmeticTransactions);
router.post("/raw/sky/ooba", decodeFormData, getRawOobaTransactions);

// lenovo
router.post("/raw/lenovo/repair", decodeFormData, getRawRepairTransactions);
router.post("/raw/lenovo/registration", decodeFormData, getRawRegistrationTransactions);
router.post("/raw/lenovo/cleaning", decodeFormData, getRawCleaningTransactions);
router.post("/raw/lenovo/final", decodeFormData, getRawFinalTestTransactions);
router.post("/raw/lenovo/packing", decodeFormData, getRawLenovoPackingTransactions);

export { router as analyticRoutes };
