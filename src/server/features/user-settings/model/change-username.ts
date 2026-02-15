import type { Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const changeUsername = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: "New username is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.username === newUsername) {
      return res
        .status(400)
        .json({ message: "New username cannot be the same as current username" });
    }

    if (user.lastUsernameChange) {
      const lastChange = new Date(user.lastUsernameChange);
      const DAYS_LIMIT = 30;

      const nextAllowedDate = new Date(lastChange);
      nextAllowedDate.setDate(lastChange.getDate() + DAYS_LIMIT);

      if (new Date() < nextAllowedDate) {
        return res.status(403).json({
          message: `You cannot change your username yet.`,
          nextAllowedChangeDate: nextAllowedDate.toISOString(),
        });
      }
    }

    user.username = newUsername;
    user.lastUsernameChange = new Date();

    await user.save();

    return res.status(200).json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Username is already taken." });
    }
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
