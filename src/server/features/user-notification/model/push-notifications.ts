import { Types } from "mongoose";
import { Notification } from "~/entities/notification/index.js";

export async function pushNotifications({ userId, type, payload }, io) {
  const newNotification = await Notification.create({
    userId: new Types.ObjectId(userId),
    type,
    ...payload,
  });

  const populatedDoc = await newNotification.populate("sender", "username");
  const plainNotification = populatedDoc.toJSON();
  const userRoom = `user_${userId}`;

  io.to(userRoom).emit("user-notification:new", plainNotification);

  return plainNotification;
}
