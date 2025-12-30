import { model, Schema, Types } from "mongoose";

const friendListSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    sentFriendRequests: [{ type: Types.ObjectId, ref: "User" }],
    receivedFriendRequests: [{ type: Types.ObjectId, ref: "User" }],
    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  {
    collection: "usersFriendsList",
    timestamps: true,
  },
);

export const FriendList = model("FriendList", friendListSchema);
