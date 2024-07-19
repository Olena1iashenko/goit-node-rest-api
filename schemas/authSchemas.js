import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const authSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().required(),
});

export const authSigninSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

export const authRefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
