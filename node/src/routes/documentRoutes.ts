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
router.post("/department", addDepartment);
router.get("/department", getDepartments);
router.put("/department/:id/:name", editDepartment);
router.delete("/department/:id", removeDepartment);

router.post("/category", addCategory);
router.get("/category/:departmentName", getCategories);
router.put("/category/:id/:name", editCategory);
router.delete("/category/:id", removeCategory);

router.post("/subcategory", addSubcategory);
router.get("/subcategory/:departmentName/:categoryName", getSubcategories);
router.put("/subcategory/:id/:name", editSubcategory);
router.delete("/subcategory/:id", removeSubcategory);

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
