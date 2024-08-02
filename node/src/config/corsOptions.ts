import { serverConfig } from "./server";
import { CorsOptions } from "cors";

const whitelist: Array<string> = [serverConfig.origin];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Accept", "Content-Type", "Authorization"],
};

export { corsOptions };
