import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import recordsRouter from "./routes/recordsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import usersRouter from "./routes/usersRouter.js";

import {
  globalErrorHandler,
  routeNotFound,
} from "./middlewares/errorHandlers.js";

const app = express();
const { PORT = 5000, DB_URI } = process.env;

app
  .use(cors({ origin: "http://localhost:3000", credentials: true }))
  .use(express.json())
  .use(cookieParser())
  .use("/records", recordsRouter)
  .use("/carts", cartRouter)
  .use("/users", usersRouter)
  .use(routeNotFound)
  .use(globalErrorHandler)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));

mongoose
  .connect(DB_URI)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error connecting to db ", err));
