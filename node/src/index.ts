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
import { UserSessionManager } from "./models/user/session/UserSessionManager";
import { SideDataSources } from "./config/SideDataSources";
import { PackedService } from "./services/analytic/PackedService";

dataSource
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);

    SideDataSources.postgres
      .initialize()
      .then(() => {
        console.log(`Side Data Source for postgres has been initialized`);

        let server: any;

        if (serverConfig.test) {
          // Initialize express-ws with the HTTP server
          server = mountWsRoute(app).listen(serverConfig.port, () =>
            console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
          );
        } else {
          // Read SSL certificate and private key
          const privateKey = fs.readFileSync("./_.reconext.com.2024.pem", "utf8");
          const certificate = fs.readFileSync("./_.reconext.com.2024.pem", "utf8");
          const credentials = { key: privateKey, cert: certificate };

          // Create HTTPS server
          server = https.createServer(credentials, app);

          // Initialize express-ws with the HTTPS server
          mountWsRoute(app, server).listen(serverConfig.port, () =>
            console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
          );
        }

        // TEST
        try {
          const packedClass = new PackedService.Handler("sky", "packing");
          packedClass.getRawTransactions_1().then((c) => {
            c.getAnalyticFiles_2().then((c) => {
              c.getJsObjects_3()
                .getTablePackedRows_4()
                .createExcelReport_5()
                .then((c) => {
                  c.sendMails_6();
                });
            });
          });
        } catch (error) {
          console.error(error);
        }

        // Graceful shutdown on SIGTERM (e.g., Docker container stop)
        process.on("SIGTERM", async () => {
          console.log("Received SIGTERM, shutting down gracefully...");

          await UserSessionManager.getInstance().clearAllSessions();

          server.close(() => {
            console.log("Server closed");
            process.exit(0);
          });
        });

        // Handle SIGINT (e.g., Ctrl+C in terminal)
        process.on("SIGINT", async () => {
          console.log("Received SIGINT, shutting down gracefully...");

          await UserSessionManager.getInstance().clearAllSessions();

          server.close(() => {
            console.log("Server closed");
            process.exit(0);
          });
        });
      })
      .catch((err) => {
        console.error("Error during Side Data Source initialization", err);
      });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
