import { model, Schema } from "mongoose";

const userWatchlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    watchlist: {
      type: [Number],
    },
  },
  {
    collection: "usersWatchlists",
    timestamps: true,
  },
);

export const Watchlist = model("UserWatchlist", userWatchlistSchema);
