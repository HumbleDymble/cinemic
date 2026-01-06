import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "node:https";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { router } from "../routes/router.js";
import { initSocket } from "../store/socket.js";
import { env } from "@/server/shared/config/index.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"],
  }),
);
app.use(router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpsOptions = {
  key: readFileSync(path.resolve(__dirname, "../../../../certs/localhost-key.pem")),
  cert: readFileSync(path.resolve(__dirname, "../../../../certs/localhost.pem")),
};

const start = async () => {
  try {
    await mongoose.connect(env.DB_CONNECT, {
      maxPoolSize: 10,
      autoIndex: false,
    });

    const httpsServer = createServer(httpsOptions, app);

    const io = initSocket(httpsServer);

    app.set("io", io);

    httpsServer.listen(env.SERVER_PORT, () => {
      console.log(`Server started on ${env.SERVER_PORT}`);
    });

    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`\n${signal} received – closing gracefully...`);
      await mongoose.disconnect();
      httpsServer.close(() => process.exit(0));
    };

    process.on("SIGINT", () => shutdown("SIGINT")).on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (e) {
    console.error(e);
  }
};

await start();
