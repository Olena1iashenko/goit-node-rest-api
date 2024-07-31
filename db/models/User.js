import { Schema, model } from "mongoose";
import { emailRegexp } from "../../constants/user-constants.js";
import { mongoSaveError, setMongoUpdateSettings } from "./hooks.js";

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    // token: { type: String },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.post("save", mongoSaveError);
usersSchema.pre("findOneAndUpdate", setMongoUpdateSettings);
usersSchema.post("findOneAndUpdate", mongoSaveError);

const User = model("User", usersSchema);

export default User;
