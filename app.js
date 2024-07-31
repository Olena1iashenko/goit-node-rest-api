import express, { response } from "express";
import morgan from "morgan";
import cors from "cors";

import env from "./utils/env.js";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const startServer = () => {
  const port = Number(env("PORT", 3000));
  const app = express();

  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/api/contacts", contactsRouter);
  app.use("/users", authRouter);

  app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((error, req, res, next) => {
    const { status = 500, message = "Server error" } = error;
    res.status(status).json({ message });
  });

  app.listen(port, () => {
    console.log(
      `Database connection successful. Server is running on ${port} PORT`
    );
  });
};

// import jwt from "jsonwebtoken";
// import "dotenv/config";

// const { JWT_SECRET } = process.env;
// const payload = {
//   id: "6697be421b899514db3c3f74",
// };

// const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
// console.log(token);
// const decodeToken = jwt.decode(token);
// console.log(decodeToken);

// try {
//   const tokenPayload = jwt.verify(token, JWT_SECRET);
// } catch (error) {
//   console.log(error.message);
// }

export default startServer;
