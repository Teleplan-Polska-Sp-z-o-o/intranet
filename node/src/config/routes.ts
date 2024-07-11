import express, { Express } from "express";

import { userRoutes } from "../routes/userRoutes";
import { permissionRoutes } from "../routes/permissionRoutes";
import { documentRoutes } from "../routes/documentRoutes";
import { departmentRoutes } from "../routes/departmentRoutes";
import { categoryRoutes } from "../routes/categoryRoutes";
import { subcategoryRoutes } from "../routes/subcategoryRoutes";
import { editorRoutes } from "../routes/editorRoutes";
import { changeRoutes } from "../routes/changeRoutes";
import { notificationRoutes } from "../routes/notificationRoutes";
import { serverRoutes } from "../routes/serverRoutes";
import { competenceRoutes } from "../routes/competenceRoutes";

const UPLOADS_PATH = "/usr/src/app/uploads";

const mountRoutes = (app: Express): Express => {
  app.use("/uploads", express.static(UPLOADS_PATH));
  // user
  app.use("/api/user/permission", permissionRoutes);
  app.use("/api/user", userRoutes);

  // document/department/category/subcategory
  app.use("/api/document/department", departmentRoutes);
  app.use("/api/document/category", categoryRoutes);
  app.use("/api/document/subcategory", subcategoryRoutes);
  app.use("/api/document", documentRoutes);
  //

  app.use("/api/editor", editorRoutes);
  app.use("/api/change", changeRoutes);
  app.use("/api/notification", notificationRoutes);
  app.use("/api/server", serverRoutes);
  app.use("/api/competence", competenceRoutes);

  return app;
};

export { mountRoutes, UPLOADS_PATH };
