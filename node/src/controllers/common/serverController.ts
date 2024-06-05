import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { serverConfig } from "../../config/server";

const ping = async (_req: Request, res: Response) => {
  try {
    if (!serverConfig.origin || !serverConfig.port)
      throw new Error(`Server config origin and/or port evaluates to false.`);

    return res.status(200).json({
      config: { origin: serverConfig.origin, port: serverConfig.port },
      message: "Success",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      config: { origin: serverConfig.origin, port: serverConfig.port },
      message: "Unknown error occurred.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { ping };
