import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  // const authorization = req.get("Authorization");
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Bearer not found"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUser({ _id: id });
    if (!user) {
      return next(HttpError(401, "User not found"));
    }
    console.log(user);
    console.log(accessToken);
    if (!user.accessToken) {
      return next(HttpError(401, "User already signout"));
    }

    req.user = user;
    console.log(user);

    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export default authenticate;
