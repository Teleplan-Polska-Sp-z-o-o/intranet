// create and setup express app
import express, { Express } from "express";

import cors from "cors";
import { corsOptionsDelegate } from "./cors";

const createExpressApp = (): Express => {
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(cors(corsOptionsDelegate));
  return expressApp;
};

export { createExpressApp };
