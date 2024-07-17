import * as authServices from "../services/authServices.js";

// import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const signup = async (res, req) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    email: newUser.email,
  });
};

export default {
  signup: ctrlWrapper(signup),
};
