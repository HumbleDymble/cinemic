import type { Review, ReviewId } from "@/entities/review";
import type { UserId } from "@/entities/user";
import type { KpMovieId } from "@/entities/media-detail";

export interface ReviewModeratedParams {
  _id: ReviewId;
  titleId: KpMovieId;
  authorId: UserId;
  authorUsername: string;
  review: Review;
  hasBeenCorrected: boolean;
}

export type ReviewAction = "approve" | "reject" | "needs_correction";

export interface ReviewModeratedParamsPayload {
  titleId: KpMovieId;
  action: ReviewAction;
  moderatorComments?: string;
}
