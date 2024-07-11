import { serverConfig } from "./server";
import { CorsOptions, CorsOptionsDelegate } from "cors";
import { Request } from "express";

const whitelist: Array<string> = [serverConfig.origin];

const corsOptions: CorsOptions = {
  origin: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Accept", "Content-Type"],
};

const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (req.query["api-key"] === serverConfig.apiKey) {
    callback(null, corsOptions);
  } else if (origin && whitelist.includes(origin)) {
    callback(null, corsOptions);
  } else if (referer && whitelist.includes(referer.slice(0, -1))) {
    callback(null, corsOptions);
  } else {
    callback(new Error("Not allowed by CORS, provide 'api-key' in request query."));
  }
};

export { corsOptionsDelegate };
