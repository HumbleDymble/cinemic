import { Types } from "mongoose";
import { Request, Response } from "express";
import { pushNotifications } from "~/features/user-notification/index.js";
import { Notification } from "~/entities/notification/index.js";

export async function adminSendNotification(req: Request, res: Response) {
  const { userId, type, title, message } = req.body;

  const senderId = req.user?._id;

  if (!userId || !type || !title || !message) {
    return res
      .status(400)
      .json({ message: "Missing required fields: userId, type, title, message." });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format." });
  }

  const allowedTypes = Notification.schema.path("type").enumValues;
  if (!allowedTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: `Invalid notification type. Must be one of: ${allowedTypes.join(", ")}` });
  }

  try {
    const io = req.app.get("io");

    const payload = {
      sender: senderId,
      title,
      message,
    };

    await pushNotifications({ userId, type, payload }, io);

    return res.status(201).json({ message: "Notification sent successfully." });
  } catch (e) {
    console.error("Error sending admin user-notification:", e);
    return res.status(500).json({ message: "Server error while sending user-notification." });
  }
}
