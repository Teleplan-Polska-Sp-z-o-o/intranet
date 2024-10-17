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
import { documentChangeRoutes } from "../routes/documentChangeRoutes";
import { MNT_PATH, UPLOADS_PATH } from "./routeConstants";
import { acknowledgeRoutes } from "../routes/acknowledgeRoutes";
import { xlsxRoutes } from "../routes/xlsxRoutes";
import { analyticFileRoutes } from "../routes/analyticFileRoutes";
import { analyticRoutes } from "../routes/analyticRoutes";

const mountRoutes = (app: Express): Express => {
  // Serve static files
  app.use("/uploads", express.static(UPLOADS_PATH));
  app.use("/mnt", express.static(MNT_PATH));

  // user
  app.use("/api/user/permission", permissionRoutes);
  app.use("/api/user", userRoutes);

  // document/department/category/subcategory
  app.use("/api/document/department", departmentRoutes);
  app.use("/api/document/category", categoryRoutes);
  app.use("/api/document/subcategory", subcategoryRoutes);
  app.use("/api/document", documentRoutes);
  //

  // acknowledge
  app.use("/api/acknowledge", acknowledgeRoutes);

  //

  app.use("/api/editor", editorRoutes);
  app.use("/api/change", changeRoutes);
  app.use("/api/notification", notificationRoutes);
  app.use("/api/server", serverRoutes);
  app.use("/api/competence", competenceRoutes);

  app.use("/api/dc", documentChangeRoutes);

  app.use("/api/xlsx", xlsxRoutes);

  app.use("/api/analytic-file", analyticFileRoutes);
  app.use("/api/analytic", analyticRoutes);

  return app;
};

export { mountRoutes };
