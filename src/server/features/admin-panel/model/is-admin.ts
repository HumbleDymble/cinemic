import type { NextFunction, Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const admin = await User.findById(userId, "_id role").lean();

    if (admin?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin rights required." });
    }

    req.user = admin;
    next();
  } catch (e) {
    console.error("isAdmin error:", e);
    return res.status(500).json({ message: "Server error during authorization." });
  }
};
