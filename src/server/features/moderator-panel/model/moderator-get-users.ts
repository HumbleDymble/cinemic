import { Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const moderatorGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: { $nin: ["admin", "moderator"] } }).select("-password");

    return res.status(200).json(users);
  } catch (e) {
    console.error("Error fetching users for moderation:", e);
    return res.status(500).json({ message: "Server error fetching users." });
  }
};
