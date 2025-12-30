import { model, Schema } from "mongoose";

const userRatingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    titleId: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
  },
  {
    collection: "usersRatings",
    timestamps: true,
  },
);

userRatingSchema.index({ userId: 1, titleId: 1 }, { unique: true });

export const Rating = model("UserRating", userRatingSchema);
