"use client";

import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  type BaseNotification,
  type NotificationId,
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetAllNotificationsQuery,
  useGetUnreadQuery,
  useMarkAsReadMutation,
} from "@/client/entities/notification";

interface Props {
  token: string | null;
}

export const useNotifications = ({ token }: Props) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [activeActionId, setActiveActionId] = useState<NotificationId | null>(null);

  const skip = !token;
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: unread = [] } = useGetUnreadQuery(skip ? skipToken : undefined);

  const { data, isLoading, isFetching } = useGetAllNotificationsQuery(
    skip ? skipToken : { page, limit },
  );

  const [markSeen] = useMarkAsReadMutation();
  const [deleteSingle] = useDeleteNotificationMutation();
  const [deleteMany, { isLoading: isDeletingMany }] = useDeleteAllNotificationsMutation();

  const [allNotifications, setAllNotifications] = useState<BaseNotification[]>([]);

  const stateRef = useRef({
    isLoading,
    isFetching,
    hasMore: false,
  });

  const unreadRef = useRef(unread);

  useEffect(() => {
    stateRef.current.isLoading = isLoading;
    stateRef.current.isFetching = isFetching;
    stateRef.current.hasMore = data ? data.currentPage < data.totalPages : false;
  }, [isLoading, isFetching, data]);

  useEffect(() => {
    unreadRef.current = unread;
  }, [unread]);

  useEffect(() => {
    setPage(1);
    setAllNotifications([]);
  }, [token]);

  useEffect(() => {
    if (data?.notifications) {
      setAllNotifications((prev) => {
        if (page === 1) return data.notifications;

        const existingIds = new Set(prev.map((n) => n._id));
        const newItems = data.notifications.filter((n) => !existingIds.has(n._id));

        if (newItems.length === 0) return prev;
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  const handleOpen = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchor(null);
    if (unreadRef.current.length > 0) {
      markSeen(unreadRef.current.map((n) => n._id));
    }
  }, [markSeen]);

  const handleDelete = useCallback(
    async (_id: NotificationId, e: MouseEvent) => {
      e.stopPropagation();

      setAllNotifications((prev) => prev.filter((n) => n._id !== _id));
      setActiveActionId(_id);

      try {
        await deleteSingle(_id).unwrap();
      } catch (e) {
        console.error("Failed to delete notification", e);
      } finally {
        setActiveActionId(null);
      }
    },
    [deleteSingle],
  );

  const handleDeleteAll = useCallback(() => {
    const idsToDelete = allNotifications.map((n) => n._id);
    if (idsToDelete.length > 0) {
      setAllNotifications([]);
      deleteMany(idsToDelete)
        .unwrap()
        .then(() => setPage(1))
        .catch(() => {
          setPage(1);
        });
    }
  }, [allNotifications, deleteMany]);

  const handleItemClick = useCallback(
    (notification: BaseNotification) => {
      setAnchor(null);

      if (!notification.isRead) {
        setActiveActionId(notification._id);
        markSeen([notification._id]).finally(() => setActiveActionId(null));
      }

      if (notification.titleId) {
        router.replace(`/title/${notification.titleId}/review-thread`);
      }
    },
    [markSeen, router],
  );

  useEffect(() => {
    const currentList = listRef.current;
    if (!currentList) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isFetching, hasMore } = stateRef.current;
        if (entry.isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { root: currentList, threshold: 0.5 },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const unreadCount = unread.length;
  const isOpen = Boolean(anchor);
  const noNotifications = !isLoading && allNotifications.length === 0;

  return {
    anchor,
    unreadCount,
    isOpen,
    noNotifications,
    handleOpen,
    handleClose,
    handleDeleteAll,
    handleItemClick,
    handleDelete,
    isLoading,
    isDeletingMany,
    activeActionId,
    isFetching,
    page,
    allNotifications,
    listRef,
    sentinelRef,
  };
};
