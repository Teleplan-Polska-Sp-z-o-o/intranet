import express from "express";

import {
  addDepartment,
  editDepartment,
  getDepartments,
  removeDepartment,
} from "../controllers/document/departmentController";
const router = express.Router();
// Define routes
router.post("", addDepartment);
router.get("/:quickAccess/:whereDocType", getDepartments);
router.put("/:id/:name", editDepartment);
router.delete("/:id", removeDepartment);

export { router as departmentRoutes };
