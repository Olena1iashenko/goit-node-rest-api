import { Schema, model } from "mongoose";
import { mongoSaveError, setMongoUpdateSettings } from "./hooks.js";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    contactURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);
contactsSchema.post("save", mongoSaveError);
contactsSchema.pre("findOneAndUpdate", setMongoUpdateSettings);
contactsSchema.post("findOneAndUpdate", mongoSaveError);
const Contacts = model("Contacts", contactsSchema);

export default Contacts;
