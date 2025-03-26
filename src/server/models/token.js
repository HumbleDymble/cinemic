import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    token: [
      {
        _id: false,
        refreshToken: {
          type: String,
        },
        uid: {
          type: String,
        },
      },
    ],
    expireAt: { type: Date, expires: process.env.SECRET_REFRESH_MAX_AGE },
  },
  {
    collection: "token",
    versionKey: false,
  },
);

export const tokenModel = mongoose.model("token", tokenSchema);
