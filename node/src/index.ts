import express from "express";
import cors from "cors";
import "reflect-metadata";

// create and setup express app
import { corsOptionsDelegate } from "./config/cors";

const app = express();
app.use(express.json());
app.use(cors(corsOptionsDelegate));

// Routes
import { userRoutes } from "./routes/userRoutes";
import { documentRoutes } from "./routes/documentRoutes";
import { editorRoutes } from "./routes/editorRoutes";
import path from "path";

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/editor", editorRoutes);

// DataSource instance initialize
import { dataSource } from "./config/orm/dataSource";
import { serverConfig } from "./config/server";

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(serverConfig.port, () =>
      console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
    );
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
