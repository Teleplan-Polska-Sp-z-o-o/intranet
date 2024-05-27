import express from "express";
import { authProvider } from "../models/msal/MSAuthProvider";
import { POST_LOGOUT_REDIRECT_URI, REDIRECT_URI } from "../config/msal/msalConfig";

const router = express.Router();

router.get(
  "/signin",
  authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: "/",
  })
);

router.get(
  "/acquireToken",
  authProvider.acquireToken({
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
    successRedirect: "/users/profile",
  })
);

router.post("/redirect", authProvider.handleRedirect());

router.get(
  "/signout",
  authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  })
);

export { router as msalRoutes };
