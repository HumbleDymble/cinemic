import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User, UserToken } from "~/entities/user/index.js";
import { env } from "~/shared/config/index.js";

export const changePassword = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const deviceId = req.cookies?.deviceId;
  const { oldPassword, newPassword, repeatPassword } = req.body;

  try {
    if (!oldPassword || !newPassword || !repeatPassword) {
      return res.status(400).json({
        message: "Old password, new password, and repeated new password are required.",
      });
    }
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password.",
      });
    }
    if (!refreshToken) {
      return res.status(401).json({ message: "Authentication required: Refresh token missing." });
    }
    if (!deviceId) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(401).json({ message: "Authentication required: Device ID missing." });
    }

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, env.SECRET_REFRESH);
    } catch (jwtError) {
      console.warn(
        "ChangePassword: Refresh token verification failed:",
        jwtError.name,
        jwtError.message,
      );
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.clearCookie("deviceId", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(403).json({ message: "Invalid or expired session. Please sign in again." });
    }

    const userIdFromToken = decodedRefreshToken.user._id;

    const activeTokenRecord = await UserToken.findOne({
      userId: userIdFromToken,
      deviceId: deviceId,
      refreshToken: refreshToken,
    }).lean();

    if (!activeTokenRecord) {
      console.warn(
        `ChangePassword: Active session for user ${userIdFromToken} on device ${deviceId} not found in DB, or token mismatch.`,
      );
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.clearCookie("deviceId", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(403).json({
        message: "Session not recognized or has been invalidated. Please sign in again.",
      });
    }

    const foundUser = await User.findOne({ _id: userIdFromToken });

    const isOldPasswordCorrect = bcrypt.compare(oldPassword, foundUser.password);

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 7);

    await User.updateOne({ _id: userIdFromToken }, { $set: { password: newHashedPassword } });

    await Token.updateOne(
      { userId: userIdFromToken },
      {
        $set: {
          deviceId: deviceId,
          refreshToken: refreshToken,
        },
      },
    );

    return res.status(200).json({ message: "Password changed." });
  } catch (e) {
    console.error("Error changing password:", e);
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.clearCookie("deviceId", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(403).json({ message: "Invalid or expired session. Please sign in again." });
    }
    return res.status(500).json({ message: "An error occurred while changing your password." });
  }
};
