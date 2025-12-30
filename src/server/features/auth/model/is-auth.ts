import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "./lib.js";
import { UserToken } from "~/entities/user/index.js";
import { env } from "~/shared/config/index.js";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, env.SECRET_ACCESS);
        const userPayload = decoded.user;

        const isBanned = userPayload.banUntil && new Date(userPayload.banUntil) > new Date();

        req.user = { ...userPayload, isBanned };
        res.locals.accessToken = accessToken;

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp - currentTime < 3600) {
          const { accessToken: newAccessToken } = generateToken({ user: req.user });
          res.locals.accessToken = newAccessToken;
        }

        return next();
      } catch (e) {
        if (e.name !== "TokenExpiredError") {
          console.warn("Received a malformed access token.");
        }
      }
    }

    const { refreshToken: refreshTokenFromCookie, deviceId: deviceIdFromCookie } = req.cookies;

    if (!refreshTokenFromCookie || !deviceIdFromCookie) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const activeSession = await UserToken.findOne({
      refreshToken: refreshTokenFromCookie,
      deviceId: deviceIdFromCookie,
    })
      .populate("userId", "_id role username banUntil")
      .lean();

    if (!activeSession?.userId) {
      res.clearCookie("refreshToken");
      res.clearCookie("deviceId");
      return res.status(401).json({ message: "Session not recognized. Please sign in again." });
    }

    const foundUser = activeSession.userId;

    try {
      const decodedRefreshToken = jwt.verify(refreshTokenFromCookie, env.SECRET_REFRESH);
      if (foundUser._id.toString() !== decodedRefreshToken.user._id) {
        return res.status(401).json({ message: "Invalid session. Please sign in again." });
      }
    } catch (e) {
      await UserToken.findByIdAndDelete(activeSession._id);
      res.clearCookie("refreshToken");
      res.clearCookie("deviceId");
      return res.status(401).json({ message: "Invalid session. Please sign in again." });
    }

    const isBanned = foundUser.banUntil && new Date(foundUser.banUntil) > new Date();

    const { accessToken: newAccessToken } = generateToken({ user: foundUser });
    res.locals.accessToken = newAccessToken;

    req.user = { ...foundUser, isBanned };

    return next();
  } catch (e) {
    return next(e);
  }
};
