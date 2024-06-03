import { serverConfig } from "./server";

const whitelist: Array<string> = [serverConfig.origin];

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Accept", "Content-Type"],
  // exposedHeaders: ["X-Custom-Header"],
  // credentials: true,
  // maxAge: 600,
};

const corsOptionsDelegate = (req, callback) => {
  if (req?.query["api-key"] === serverConfig.apiKey) callback(null, corsOptions);
  else if (whitelist.includes(req.headers.origin)) callback(null, { origin: true });
  else if (whitelist.includes(req.headers.referer.slice(0, -1))) callback(null, { origin: true });
  else callback(new Error("Not allowed by CORS, provide 'api-key' in request query."));
};

export { corsOptionsDelegate };
