import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { LDAP } from "../../models/user/LDAP";

const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.token;
    const ldap = new LDAP();

    const resultOfVerification = ldap.verifyJwt(token);
    const status = resultOfVerification ? true : false;
    const message = status ? "Token verified successfully." : "Token verified unsuccessfully.";

    return res.status(200).json({
      token: status,
      message: message,
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      token: false,
      message: "Unknown error occurred. Failed to verify token.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.token;
    const ldap = new LDAP();

    const refreshedToken = ldap.refreshJwt(token);

    return res.status(200).json({
      token: refreshedToken,
      message: "Token refreshed successfully.",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({
      token: "",
      message: "Unknown error occurred. Failed to refresh token.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { verifyToken, refreshToken };
