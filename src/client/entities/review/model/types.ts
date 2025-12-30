import type { UserId } from "@/entities/user";
import type { Brand } from "@/shared/lib/types";

export type ReviewId = Brand<string, "ReviewId">;

export interface Review {
  _id: ReviewId;
  userId: UserId;
  titleId: number;
  title: string;
  text: string;
  rating?: number | null;
  votes?: Record<string, 1 | -1>;
  likeCount: number;
  dislikeCount: number;
  status: "pending" | "approved" | "rejected" | "needs_correction";
  previousStatus?: "pending" | "approved" | "rejected" | "needs_correction";
  createdAt: string;
  updatedAt: string;
  uploadedAt: string | number | Date;
  hasBeenCorrected?: boolean;
}
