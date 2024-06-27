import express from "express";
import multer from "multer";

import {
  addDepartment,
  editDepartment,
  getDepartments,
  removeDepartment,
} from "../controllers/document/departmentController";
import {
  addCategory,
  editCategory,
  removeCategory,
  getCategories,
} from "../controllers/document/categoryController";
import {
  addSubcategory,
  editSubcategory,
  getSubcategories,
  removeSubcategory,
} from "../controllers/document/subcategoryController";
import {
  addDocument,
  editDocument,
  getDocumentByUuidAndLangs,
  getDocuments,
  getDocumentsByDep,
  getDocumentsByDepCat,
  getDocumentsByDepCatSub,
  removeDocument,
} from "../controllers/document/documentController";

const router = express.Router();
const upload = multer({ dest: `${__dirname}/../../uploads/documents` });
// Define routes

router.post("/", upload.any(), addDocument);
router.put("/", upload.any(), editDocument);
router.delete("/:id", removeDocument);
router.get("/uuidLangs/:uuid/:langs", getDocumentByUuidAndLangs);
router.get("/:type/:reduce/:confidentiality", getDocuments);
router.get("/:departmentName/:type/:reduce/:confidentiality", getDocumentsByDep);
router.get("/:departmentName/:categoryName/:type/:reduce/:confidentiality", getDocumentsByDepCat);
router.get(
  "/:departmentName/:categoryName/:subcategoryName/:type/:reduce/:confidentiality",
  getDocumentsByDepCatSub
);

export { router as documentRoutes };
