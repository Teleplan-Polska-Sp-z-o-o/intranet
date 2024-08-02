// create and setup express app
import express, { Express } from "express";
import cors from "cors";
import { corsOptions } from "./corsOptions";
import jwt from "./middleware/jwt";

const createExpressApp = (): Express => {
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(cors(corsOptions));
  expressApp.use(jwt);
  return expressApp;
};

export { createExpressApp };
