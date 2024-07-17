import express from "express";

import validateBody from "../helpers/validateBody.js";
import isEmptyBody from "../helpers/isEmptyBody.js";

import authControllers from "../controllers/authControllers.js";

import { authSigninSchema, authSignupSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

// authRouter.get(
//   "/:id",
//   isEmptyBody,
//   validateBody(authSigninSchema),
//   authControllers.signin
// );

// authRouter.delete("/:id", deleteContact);

// authRouter.post("/", createContact);

// authRouter.put("/:id", updateContact);

export default authRouter;
