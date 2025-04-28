import express from "express";
import multer from "multer";
import {
  getRawSkyPackingTransactions,
  getRawCosmeticTransactions,
  getRawOobaTransactions,
  getRawSkyTestTransactions,
} from "../sideControllers/sky/TransactionsRawController";
import {
  getRawRegistrationTransactions,
  // getRawCleaningTransactions,
  getRawFinalTestTransactions,
  getRawLenovoPackingTransactions,
  getRawRepairTransactions,
} from "../sideControllers/lenovo/TransactionsRawController";

import {
  getVmiTransactions,
  getScreeningTransactions,
  getWinTestTransactions,
  getFinalTestTransactions,
  // getActivationTransactions,
  // getCustomizationTransactions,
  // getKeyInjectionTransactions,
  getFgiTransactions,
  getRepair2Transactions,
  getRepair3Transactions,
  getObaTransactions,
} from "../sideControllers/ingenico/TransactionsRawController";
import { getIngenicoModels } from "../sideControllers/ingenico/ModelsController";
import {
  getRawCosmTransactions,
  getRawDebugRepairTransactions,
  getRawHighPotTransactions,
  getRawPackTransactions,
  // getRawShipTransactions,
  getRawTestTransactions,
  getRawVmiTransactions,
} from "../sideControllers/liberty/TransactionsRawController";

import {
  getDellEcoCheckTransactions,
  getDellEcoWorksTransactions,
  getDellFchTransactions,
  getDellFinalTestTransactions,
  getDellHoldTransactions,
  getDellObaTransactions,
  getDellPackTransactions,
  getDellRepairL1L2Transactions,
  getDellRepairL3Transactions,
  getDellScrapTransactions,
  getDellScreeningTransactions,
  getDellShipTransactions,
  getDellVmiTransactions,
  getDellWffaTransactions,
} from "../sideControllers/dell/TransactionsRawController";
import { getCombinedTransactions } from "../sideControllers/bose/TransactionsRawController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes

//sky
router.post("/raw/sky/packing", decodeFormData, getRawSkyPackingTransactions);
router.post("/raw/sky/cosmetic", decodeFormData, getRawCosmeticTransactions);
router.post("/raw/sky/ooba", decodeFormData, getRawOobaTransactions);
// router.post("/raw/sky/test", decodeFormData, getRawSkyTestTransactions);
router.post("/raw/sky/test", decodeFormData, getRawSkyTestTransactions);

// lenovo
router.post("/raw/lenovo/repair", decodeFormData, getRawRepairTransactions);
router.post("/raw/lenovo/registration", decodeFormData, getRawRegistrationTransactions);
// router.post("/raw/lenovo/cleaning", decodeFormData, getRawCleaningTransactions);
router.post("/raw/lenovo/final", decodeFormData, getRawFinalTestTransactions);
router.post("/raw/lenovo/packing", decodeFormData, getRawLenovoPackingTransactions);

router.post("/ingenico/models", decodeFormData, getIngenicoModels);
router.post("/raw/ingenico/vmi", decodeFormData, getVmiTransactions);
router.post("/raw/ingenico/screening", decodeFormData, getScreeningTransactions);
router.post("/raw/ingenico/wintest", decodeFormData, getWinTestTransactions);
router.post("/raw/ingenico/finaltest", decodeFormData, getFinalTestTransactions);
// router.post("/raw/ingenico/activation", decodeFormData, getActivationTransactions);
// router.post("/raw/ingenico/customization", decodeFormData, getCustomizationTransactions);
// router.post("/raw/ingenico/keyinjection", decodeFormData, getKeyInjectionTransactions);
router.post("/raw/ingenico/fgi", decodeFormData, getFgiTransactions);
router.post("/raw/ingenico/repair2", decodeFormData, getRepair2Transactions);
router.post("/raw/ingenico/repair3", decodeFormData, getRepair3Transactions);
router.post("/raw/ingenico/oba", decodeFormData, getObaTransactions);

router.post("/raw/liberty/vmi", decodeFormData, getRawVmiTransactions);
router.post("/raw/liberty/test", decodeFormData, getRawTestTransactions);
router.post("/raw/liberty/debugrepair", decodeFormData, getRawDebugRepairTransactions);
router.post("/raw/liberty/cosmetic", decodeFormData, getRawCosmTransactions);
router.post("/raw/liberty/highpot", decodeFormData, getRawHighPotTransactions);
router.post("/raw/liberty/pack", decodeFormData, getRawPackTransactions);
// router.post("/raw/liberty/ship", decodeFormData, getRawShipTransactions);
router.post("/raw/liberty/ooba", decodeFormData, getRawOobaTransactions);

router.post("/raw/dell/vmi", decodeFormData, getDellVmiTransactions);
router.post("/raw/dell/wffa", decodeFormData, getDellWffaTransactions);
router.post("/raw/dell/pack", decodeFormData, getDellPackTransactions);
router.post("/raw/dell/finaltest", decodeFormData, getDellFinalTestTransactions);
router.post("/raw/dell/ecocheck", decodeFormData, getDellEcoCheckTransactions);
router.post("/raw/dell/fch", decodeFormData, getDellFchTransactions);
router.post("/raw/dell/repairl1l2", decodeFormData, getDellRepairL1L2Transactions);
router.post("/raw/dell/screening", decodeFormData, getDellScreeningTransactions);
router.post("/raw/dell/ecoworks", decodeFormData, getDellEcoWorksTransactions);
router.post("/raw/dell/oba", decodeFormData, getDellObaTransactions);
router.post("/raw/dell/repairl3", decodeFormData, getDellRepairL3Transactions);
router.post("/raw/dell/scrap", decodeFormData, getDellScrapTransactions);
router.post("/raw/dell/hold", decodeFormData, getDellHoldTransactions);
router.post("/raw/dell/ship", decodeFormData, getDellShipTransactions);

router.post("/raw/bose/combined", decodeFormData, getCombinedTransactions);

export { router as analyticRoutes };
