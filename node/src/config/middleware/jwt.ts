import { HttpResponseMessage } from "../../enums/response";
import { LDAP } from "../../models/user/LDAP";
import { Request, Response, NextFunction } from "express";
import { UserSessionManager } from "../../models/user/session/UserSessionManager";

const jwtMiddle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const openPaths = ["/api/user/auth", "/uploads/", "/ws"];

    const isPathOpen = openPaths.some((path) => req.path.startsWith(path));
    if (isPathOpen) {
      return next();
    }

    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        message: "No authorization token provided.",
        statusMessage: HttpResponseMessage.UNAUTHORIZED,
      });
    }

    const result = new LDAP().verifyJwt(token.split(" ").at(1));
    if (!result) {
      return res.status(401).json({
        message: "Invalid token.",
        statusMessage: HttpResponseMessage.UNAUTHORIZED,
      });
    } else {
      req.user = result;

      const userSessionManager = UserSessionManager.getInstance();
      await userSessionManager.addUser(result.id);

      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "jwt verification has failed.",
      statusMessage: HttpResponseMessage.UNAUTHORIZED,
    });
  }
};

export default jwtMiddle;
