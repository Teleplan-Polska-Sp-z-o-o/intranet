import express from "express";
// import session from "express-session";
import cors from "cors";
import "reflect-metadata";

// create and setup express app
import { corsOptionsDelegate } from "./config/cors";

import expressWs from "express-ws";
const app = express();

app.use(express.json());
app.use(cors(corsOptionsDelegate));

import { serverConfig } from "./config/server";

// app.use(
//   session({
//     secret: process.env.MS_EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: serverConfig.test ? false : true, // set this to true on production
//     },
//   })
// );

// Routes
import { userRoutes } from "./routes/userRoutes";
import { documentRoutes } from "./routes/documentRoutes";
import { editorRoutes } from "./routes/editorRoutes";
import { changeRoutes } from "./routes/changeRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";

import path from "path";

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/change", changeRoutes);
app.use("/api/notification", notificationRoutes);

// import { msalRoutes } from "./routes/msalRoutes";
// app.use("/api/msal", msalRoutes);

// DataSource instance initialize
import { dataSource } from "./config/orm/dataSource";
import { websocketController } from "./controllers/common/websocketController";
import * as fs from "fs";
import https from "https";

dataSource
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized!`);

    if (serverConfig.test) {
      // Initialize express-ws with the HTTP server
      expressWs(app);
      app.ws("/", websocketController);

      app.listen(serverConfig.port, () =>
        console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
      );
    } else {
      // Read SSL certificate and private key
      const privateKey = fs.readFileSync("./_.reconext.com.2024.pem", "utf8");
      const certificate = fs.readFileSync("./_.reconext.com.2024.pem", "utf8");
      const credentials = { key: privateKey, cert: certificate };

      // Create HTTPS server
      const httpsServer = https.createServer(credentials, app);

      // Initialize express-ws with the HTTPS server
      expressWs(app, httpsServer);
      app.ws("/", websocketController);

      // Listen on specified port for HTTPS
      httpsServer.listen(serverConfig.port, () =>
        console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
      );
    }
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
