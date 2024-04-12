import express from "express";
import cors from "cors";
import "reflect-metadata";

// create and setup express app
import { corsOptionsDelegate } from "./config/cors";

import expressWs from "express-ws";
const app = express();
expressWs(app);

app.use(express.json());
app.use(cors(corsOptionsDelegate));

// Routes
import { userRoutes } from "./routes/userRoutes";
import { documentRoutes } from "./routes/documentRoutes";
import { editorRoutes } from "./routes/editorRoutes";
import { changeRoutes } from "./routes/changeRoutes";

import path from "path";

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/change", changeRoutes);

// DataSource instance initialize
import { dataSource } from "./config/orm/dataSource";
import { serverConfig } from "./config/server";
import { storeWebSocketConnections } from "./controllers/websocket/websocketController";

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // app.ws("/", function (ws: any, _req: Request) {
    //   console.log("Client connected");
    //   //an event listener is set up for incoming WebSocket messages.
    //   ws.on("message", function (msg: string) {
    //     console.log(msg);
    //     // Send a message to the client
    //   });

    //   ws.send("Hello from the server!");
    // });

    app.ws("/", storeWebSocketConnections);

    app.listen(serverConfig.port, () =>
      console.log(`Node listens at ${serverConfig.origin}:${serverConfig.port}`)
    );
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
