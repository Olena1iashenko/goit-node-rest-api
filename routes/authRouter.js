import express from "express";

import validateBody from "../helpers/validateBody.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import {
  authSigninSchema,
  authSignupSchema,
  authRefreshTokenSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

authRouter.post(
  "/refresh",
  isEmptyBody,
  validateBody(authRefreshTokenSchema),
  authControllers.refresh
);

authRouter.post("/logout", authenticate, authControllers.signout);

export default authRouter;
