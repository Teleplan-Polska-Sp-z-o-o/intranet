import express from "express";
import multer from "multer";
import {
  addCompetence,
  editCompetence,
  getCompetences,
  removeCompetence,
} from "../controllers/document/competenceController";

const router = express.Router();
const decodeFormData = multer().none();

// Define routes
router.post("/", decodeFormData, addCompetence);
router.put("/", decodeFormData, editCompetence);

router.delete("/:id", removeCompetence);
router.get("/:folderStructure", getCompetences);

export { router as competenceRoutes };
