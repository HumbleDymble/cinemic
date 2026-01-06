import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "../env/env";

export const socket: Socket = io(env.NEXT_PUBLIC_SERVER_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("🔌 socket  connected:", socket.id);
});
socket.on("disconnect", (reason) => {
  console.log("🔌 socket disconnected:", reason);
});
