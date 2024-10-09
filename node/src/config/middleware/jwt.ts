import { HttpResponseMessage } from "../../enums/response";
import { LDAP } from "../../models/user/LDAP";
import { Request, Response, NextFunction } from "express";
import { UserSessionManager } from "../../models/user/session/UserSessionManager";
import { SimpleUser } from "../../models/user/SimpleUser";

const jwtMiddle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If `req.user` exists at the start, it means something suspicious is going on
    if (req.hasOwnProperty("user")) {
      return res.status(401).json({
        message:
          "Unauthorized attempt detected. Authentication mechanism prevents any external tampering with the 'user' property.",
        statusMessage: HttpResponseMessage.UNAUTHORIZED,
      });
    }

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

    const result = new LDAP().verifyJwt(token.split(" ").at(1), true) as SimpleUser | false; // because of checkAndReturnSimpleUser: true;
    if (!result) {
      return res.status(401).json({
        message: "Invalid token.",
        statusMessage: HttpResponseMessage.UNAUTHORIZED,
      });
    } else {
      req.user = result;

      if (!result.uuid) {
        const userSessionManager = UserSessionManager.getInstance();
        await userSessionManager.addUser(result.id);
      }

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
