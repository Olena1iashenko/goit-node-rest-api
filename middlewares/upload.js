import multer from "multer";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

//щоб не зберігались файли з розширенням .exe
const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split("").pop();
  if (extension === "exe") {
    return callback(HttpError(400, ".exe is not allowed extension"));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
