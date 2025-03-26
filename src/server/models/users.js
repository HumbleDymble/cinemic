import mongoose, { Schema } from "mongoose";

export const usersSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    watchlist: {
      type: [String],
    },
    // device: [String],
  },
  {
    collection: "users",
    versionKey: false,
  },
);

export const usersModel = mongoose.model("users", usersSchema);
