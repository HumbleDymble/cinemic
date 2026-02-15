import type { Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const adminUpdateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json(user);
  } catch (e) {
    console.error("Error updating role for user:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
