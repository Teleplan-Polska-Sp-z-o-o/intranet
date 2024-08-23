import express from "express";

import {
  addSubcategory,
  editSubcategory,
  getSubcategories,
  removeSubcategory,
} from "../controllers/document/subcategoryController";

const router = express.Router();
// Define routes

router.post("", addSubcategory);
router.get("/:departmentName/:categoryName/:quickAccess/:whereDocType", getSubcategories);
router.put("/:id/:name", editSubcategory);
router.delete("/:id", removeSubcategory);

export { router as subcategoryRoutes };
