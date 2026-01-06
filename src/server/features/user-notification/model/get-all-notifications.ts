import { Request, Response } from "express";
import { Notification } from "@/server/entities/notification/index.js";

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = { userId, isDeleted: false };

    const [docs, total] = await Promise.all([
      Notification.find(query)
        .populate("sender", "username type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query),
    ]);

    return res.status(200).json({
      notifications: docs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error fetching notifications." });
  }
};
