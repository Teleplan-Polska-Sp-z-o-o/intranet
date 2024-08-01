import "reflect-metadata";

import { createExpressApp } from "./config/expressApp";
import { mountRoutes } from "./config/routes";
const app = mountRoutes(createExpressApp());

import { mountScheduledTasks } from "./config/scheduler";
mountScheduledTasks();

// DataSource instance initialize
import { dataSource } from "./config/dataSource";
import { mountWsRoute } from "./config/ws";
import { serverConfig } from "./config/server";
import * as fs from "fs";
import https from "https";

dataSource
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized!`);

    if (serverConfig.test) {
      // Initialize express-ws with the HTTP server
      mountWsRoute(app).listen(serverConfig.port, () =>
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
      mountWsRoute(app, httpsServer).listen(serverConfig.port, () =>
        console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
      );
    }
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
