import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv/config";
import { router } from "./router/index.js";
import cookieParser from "cookie-parser";

const result = dotenv;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use("/user", router);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, { autoIndex: false });

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`server started on ${process.env.SERVER_PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

await start();
