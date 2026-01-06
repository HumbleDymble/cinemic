import { model, Schema } from "mongoose";

const userSchema = new Schema(
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
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    banUntil: {
      type: Date,
      default: null,
    },
    lastUsernameChange: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "users",
  },
);

export const User = model("User", userSchema);
