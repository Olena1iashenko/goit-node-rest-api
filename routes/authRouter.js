import express from "express";

import validateBody from "../helpers/validateBody.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import authControllers from "../controllers/authControllers.js";

import {
  authSigninSchema,
  authSignupSchema,
  authRefreshTokenSchema,
  authEmailSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authControllers.updateAvatar
);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(authEmailSchema),
  authControllers.resendVerifyEmail
);

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
