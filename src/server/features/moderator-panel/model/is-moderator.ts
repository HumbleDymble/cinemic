import type { NextFunction, Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const moderator = await User.findById(userId, "_id role").lean();

    if (!moderator || moderator.role === "user") {
      return res.status(403).json({ message: "Forbidden: moderator rights required." });
    }

    req.user = moderator;
    next();
  } catch (e) {
    console.error("isModerator error:", e);
    return res.status(500).json({ message: "Server error during authorization." });
  }
};
