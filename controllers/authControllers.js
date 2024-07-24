import * as authServices from "../services/authServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";

import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  const url = gravatar.url({ email }, { s: "250" });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL: url,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    // password: newUser.password,
  });
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  await authServices.updateUser({ _id: id }, { accessToken, refreshToken });

  res.json({
    user: {
      // token: token,
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const refresh = async (req, res, next) => {
  const { refreshToken: newToken } = req.body;

  try {
    const { id } = jwt.verify(newToken, JWT_SECRET);

    const payload = { id };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(HttpError(403, "Refresh token invalid"));
  }
};

const signout = async (req, res, next) => {
  const { _id } = req.user;
  if (!req.user.refreshToken) {
    throw HttpError(403, "User already signout");
  }

  await authServices.updateUser({ _id }, { accessToken: "", refreshToken: "" });

  res.status(204).json({
    message: "Signout succesfully",
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { filename } = req.file;
  const img = filename.replace(".jpg", "");
  Jimp.read(filename)
    .then((img) => {
      return img.resize(250, 250);
    })
    .catch((err) => {
      console.error(err);
    });

  const avatarURL = path.join("public", "avatars", filename);
  const updatedAvatar = await authServices.updateUser({ _id }, { avatarURL });

  if (!updatedAvatar) {
    throw HttpError(401, "Could not update avatar");
  }
  res.json({ message: `Avatar updated successfully`, updatedAvatar });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  refresh: ctrlWrapper(refresh),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
