import { Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const adminGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password").sort({ role: -1, createdAt: -1 });

    return res.status(200).json(users);
  } catch (e) {
    console.error("Error fetching users for admin:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
