import type { UserId } from "@/entities/user";
import type { KpMovieId } from "@/entities/media-detail";
import type { ReviewId } from "@/entities/review";
import type { Brand } from "@/shared/lib/types";

export type NotificationId = Brand<string, "NotificationId">;

export interface BaseNotification {
  _id: NotificationId;
  userId: UserId;
  sender: UserId;
  titleId?: KpMovieId;
  reviewId?: ReviewId;
  type: "system" | "friend_request" | "review";
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AllNotificationsResponse {
  notifications: BaseNotification[];
  currentPage: number;
  totalPages: number;
  total: number;
}
