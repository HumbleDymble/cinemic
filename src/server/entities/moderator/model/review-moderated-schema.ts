import { model, Schema, Types } from "mongoose";

const reviewModeratedSchema = new Schema(
  {
    reviewId: { type: Types.ObjectId, ref: "Review", required: true },
    moderatedBy: { type: Types.ObjectId, ref: "User" },
    moderatedAt: { type: Date },
    moderatorComments: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs_correction"],
      default: "pending",
    },
    previousStatus: { type: String, enum: ["pending", "approved", "rejected", "needs_correction"] },
  },
  { timestamps: true, collection: "reviewsModerated" },
);

export const ReviewModerated = model("ReviewModerated", reviewModeratedSchema);
