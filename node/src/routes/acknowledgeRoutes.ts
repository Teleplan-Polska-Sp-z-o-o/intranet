import express from "express";
import multer from "multer";
import {
  addToAcknowledge,
  closeToAcknowledge,
  editToAcknowledge,
  getToAcknowledges,
  removeToAcknowledge,
} from "../controllers/acknowledge/toAcknowledgeController";
import {
  addUserAcknowledgement,
  editUserAcknowledgement,
  getUserAcknowledgements,
  removeUserAcknowledgement,
} from "../controllers/acknowledge/userAcknowledgementController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("to", decodeFormData, addToAcknowledge);
router.put("to", decodeFormData, editToAcknowledge);
router.put("to/close", decodeFormData, closeToAcknowledge);
router.delete("to/:id", removeToAcknowledge);
router.get("to/:closed/:source?", getToAcknowledges);

router.post("user", decodeFormData, addUserAcknowledgement);
router.put("user", decodeFormData, editUserAcknowledgement);
router.delete("user/:id", removeUserAcknowledgement);
router.get("user/:closed/:source?", getUserAcknowledgements);

export { router as acknowledgeRoutes };
