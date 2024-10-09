// create and setup express app
import express, { Express } from "express";
import cors from "cors";
import jwtMiddle from "./middleware/jwt";
import { corsOptions } from "./corsOptions";

const createExpressApp = (): Express => {
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(cors(corsOptions));
  expressApp.use(jwtMiddle);

  return expressApp;
};

export { createExpressApp };
