import { Express } from "express";
import { websocketController } from "../controllers/common/websocketController";
import expressWs from "express-ws";
import https from "https";
import { Server } from "http";

const mountWsRoute = (app: Express, server?: Server | https.Server): expressWs.Application => {
  const wsInstance = expressWs(app, server);
  const wsApp: expressWs.Application = wsInstance.app;
  wsApp.ws("/", websocketController);
  return wsApp;
};

export { mountWsRoute };
