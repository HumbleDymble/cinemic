import { model, Schema } from "mongoose";
import { env } from "@/server/shared/config/index.js";

const userTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceId: { type: String, required: true },
    refreshToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "usersTokens",
  },
);

userTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: env.SECRET_REFRESH_MAX_AGE });

export const UserToken = model("UserToken", userTokenSchema);
