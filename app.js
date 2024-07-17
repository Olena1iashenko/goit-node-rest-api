import express from "express";
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

export default startServer;
