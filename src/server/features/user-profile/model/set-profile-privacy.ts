import type { Request, Response } from "express";
import { FriendList } from "~/entities/user/index.js";

export const setProfilePrivacy = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const { privacy } = req.body;
    const validSettings = ["public", "friends", "private"];

    if (!privacy || !validSettings.includes(privacy)) {
      return res.status(400).json({ message: "Invalid privacy setting provided." });
    }

    await FriendList.findOneAndUpdate({ userId }, { $set: { privacy: privacy } });

    return res.status(200).json({ message: "Privacy setting updated successfully." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
