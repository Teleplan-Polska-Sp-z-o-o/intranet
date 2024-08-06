import { Express } from "express";
import { WebsocketManager } from "../models/websocket/WebsocketManager";
import expressWs from "express-ws";
import https from "https";
import { Server } from "http";

const mountWsRoute = (
  app: Express,
  server?: Server | https.Server
): Server | https.Server | expressWs.Application => {
  const wsInstance = expressWs(app, server);
  const wsApp: expressWs.Application = wsInstance.app;
  wsApp.ws("/ws", WebsocketManager);
  return server ? server : wsApp;
};

export { mountWsRoute };
