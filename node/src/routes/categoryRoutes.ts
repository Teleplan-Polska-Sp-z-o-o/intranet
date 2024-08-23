import express from "express";

import {
  addCategory,
  editCategory,
  removeCategory,
  getCategories,
} from "../controllers/document/categoryController";
const router = express.Router();
// Define routes

router.post("", addCategory);
router.get("/:departmentName/:quickAccess/:whereDocType", getCategories);
router.put("/:id/:name", editCategory);
router.delete("/:id", removeCategory);

export { router as categoryRoutes };
