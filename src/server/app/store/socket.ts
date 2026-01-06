import https from "node:https";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "@/server/shared/config/index.js";

export const initSocket = (httpsServer: https.Server) => {
  const io = new Server(httpsServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth.token ||
      (socket.handshake.headers.authorization || "").replace(/^Bearer\s+/, "");

    if (!token) {
      console.log("Socket: Connection attempt without token.");
      next(new Error("Authentication error: Token not provided."));
      return;
    }

    const { user } = jwt.verify(token, env.SECRET_ACCESS);

    socket.userId = user._id;
    console.log(`Socket: User ${socket.userId} authenticated for socket ${socket.id}`);
    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket: User ${socket.userId} (socket ${socket.id}) connected.`);

    const userRoom = `user_${socket.userId}`;
    socket.join(userRoom);
    console.log(`Socket: User ${socket.userId} (socket ${socket.id}) joined room ${userRoom}`);

    socket.emit("welcome", `Welcome, User ${socket.userId}! You are connected.`);

    socket.on("disconnect", (reason) => {
      console.log(
        `Socket: User ${socket.userId} (socket ${socket.id}) disconnected. Reason: ${reason}`,
      );
    });
  });
  return io;
};
