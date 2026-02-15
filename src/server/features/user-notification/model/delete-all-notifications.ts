import { Types } from "mongoose";
import type { Request, Response } from "express";
import { Notification } from "~/entities/notification/index.js";

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.some((id) => !Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Body.ids must be an array of ObjectIds." });
    }

    const { modifiedCount } = await Notification.updateMany(
      { _id: { $in: ids }, userId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );

    if (modifiedCount === 0) {
      return res.status(404).json({ message: "No matching user-notification found to delete." });
    }

    return res.status(200).json({ message: `${modifiedCount} notification(s) deleted.` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error deleting user-notification." });
  }
};
