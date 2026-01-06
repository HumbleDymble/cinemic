import { Types } from "mongoose";
import { Request, Response } from "express";
import { Notification } from "@/server/entities/notification/index.js";

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user-notification ID." });
    }

    const { deletedCount } = await Notification.deleteOne({
      _id: id,
      userId,
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Notification not found or you do not have permission to delete it." });
    }

    return res.status(200).json({ message: "Notification deleted successfully." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error deleting user-notification." });
  }
};
