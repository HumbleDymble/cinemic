import { Request, Response } from "express";
import { Notification } from "@/server/entities/notification/index.js";

export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const docs = await Notification.find({ userId, isRead: false, isDeleted: false })
      .populate("sender", "username type")
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error fetching notifications." });
  }
};
