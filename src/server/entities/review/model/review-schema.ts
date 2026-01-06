import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    titleId: { type: Number, ref: "MediaDetail", required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10 },
    votes: {
      type: Map,
      of: Number,
      default: () => new Map(),
      validate: {
        validator(map: number[]) {
          return [...map.values()].every((v) => v === 1 || v === -1);
        },
      },
    },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs_correction"],
      default: "pending",
    },
    previousStatus: { type: String, enum: ["pending", "approved", "rejected", "needs_correction"] },
    hasBeenCorrected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "reviews" },
);

reviewSchema.index({ userId: 1, titleId: 1 }, { unique: true });

export const Review = model("UserReview", reviewSchema);
