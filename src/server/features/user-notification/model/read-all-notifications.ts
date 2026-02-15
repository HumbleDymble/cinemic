import { Types } from "mongoose";
import type { Request, Response } from "express";
import { Notification } from "~/entities/notification/index.js";

export const readAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.some((id) => !Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Body.ids must be an array of ObjectIds." });
    }

    const { modifiedCount } = await Notification.updateMany(
      { _id: { $in: ids }, userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return res.status(200).json({ message: `${modifiedCount} notification(s) marked as read.` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error updating user-notification." });
  }
};
