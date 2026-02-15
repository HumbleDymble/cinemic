import type { Request, Response } from "express";
import { FriendList } from "~/entities/user/index.js";

export const friendList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const friendListDoc = await FriendList.findOne({ userId })
      .populate({
        path: "friends",
        select: "username",
      })
      .lean();

    if (!friendListDoc) {
      return res.status(200).json({ friends: [] });
    }

    return res.status(200).json({ friends: friendListDoc.friends });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
