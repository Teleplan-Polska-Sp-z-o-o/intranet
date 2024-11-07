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

import {
  getVmiTransactions,
  getScreeningTransactions,
  getWinTestTransactions,
  getFinalTestTransactions,
  getActivationTransactions,
  getCustomizationTransactions,
  getKeyInjectionTransactions,
  getFgiTransactions,
  getRepair2Transactions,
  getRepair3Transactions,
} from "../sideControllers/ingenico/TransactionsRawController";
import { getIngenicoModels } from "../sideControllers/ingenico/ModelsController";

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

router.post("/ingenico/models", decodeFormData, getIngenicoModels);
router.post("/raw/ingenico/vmi", decodeFormData, getVmiTransactions);
router.post("/raw/ingenico/screening", decodeFormData, getScreeningTransactions);
router.post("/raw/ingenico/wintest", decodeFormData, getWinTestTransactions);
router.post("/raw/ingenico/finaltest", decodeFormData, getFinalTestTransactions);
router.post("/raw/ingenico/activation", decodeFormData, getActivationTransactions);
router.post("/raw/ingenico/customization", decodeFormData, getCustomizationTransactions);
router.post("/raw/ingenico/keyinjection", decodeFormData, getKeyInjectionTransactions);
router.post("/raw/ingenico/fgi", decodeFormData, getFgiTransactions);
router.post("/raw/ingenico/repair2", decodeFormData, getRepair2Transactions);
router.post("/raw/ingenico/repair3", decodeFormData, getRepair3Transactions);

export { router as analyticRoutes };
