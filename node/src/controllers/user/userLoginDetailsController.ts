import { Request, Response } from "express";
import { dataSource } from "../../config/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { UserLoginDetails } from "../../orm/entity/user/UserLoginDetailsEntity";

const getLoginDetails = async (_req: Request, res: Response) => {
  try {
    const loginDetails = await dataSource.getRepository(UserLoginDetails).find({
      relations: ["user"],
    });
    res.status(200).json({
      loginDetails,
      message: "loginDetails found.",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error(`Error retrieving login details: ${error}`);
    return res.status(500).json({
      message: "Failed to retrieve login details",
      error: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getLoginDetails };
