"use client";

import { type ReactNode, useEffect } from "react";
import { signOut } from "@/client/entities/user";
import { type BaseNotification, notificationEndpoints } from "@/client/entities/notification";
import { socket, useAppDispatch, useAppSelector } from "@/client/shared/config";
import { baseApi } from "@/client/shared/api";

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const limit = 10;

  useEffect(() => {
    if (!token) return;

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    const onNew = (notification: BaseNotification) => {
      dispatch(
        notificationEndpoints.util.updateQueryData("getUnread", undefined, (draft) => {
          draft.unshift(notification);
        }),
      );

      dispatch(
        notificationEndpoints.util.updateQueryData(
          "getAllNotifications",
          { page: 1, limit },
          (draft) => {
            if (draft) {
              draft.notifications.unshift(notification);
              draft.total += 1;
            }
          },
        ),
      );
    };

    const onError = (err: Error & { message?: string }) => {
      if (err.message?.includes("Authentication error")) {
        dispatch(signOut());
        dispatch(baseApi.util.resetApiState());
      } else {
        console.error("Socket error:", err);
      }
    };

    socket.on("user-notification:new", onNew);
    socket.on("connect_error", onError);

    return () => {
      console.log("🔌 Cleaning up socket connection...");
      socket.off("user-notification:new", onNew);
      socket.off("connect_error", onError);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [token, dispatch]);

  return <>{children}</>;
};
