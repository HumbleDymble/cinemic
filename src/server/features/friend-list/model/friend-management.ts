import { Request, Response } from "express";
import { FriendList } from "@/server/entities/user/index.js";

const performFriendAction = async (
  res: Response,
  action: () => Promise<void>,
  successMessage: string,
) => {
  try {
    await action();
    res.status(200).json({ message: successMessage });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error: ${e.message}` });
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const requesterId = req.user?._id;
  const { userId: recipientId } = req.params;

  if (requesterId.toString() === recipientId) {
    return res.status(400).json({ message: "You cannot send a friend request to yourself." });
  }

  await performFriendAction(
    res,
    async () => {
      await FriendList.findOneAndUpdate(
        { userId: requesterId },
        { $addToSet: { sentFriendRequests: recipientId } },
      );
      await FriendList.findOneAndUpdate(
        { userId: recipientId },
        { $addToSet: { receivedFriendRequests: requesterId } },
      );
    },
    "Friend request sent.",
  );
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const recipientId = req.user?._id;
  const { userId: requesterId } = req.params;

  await performFriendAction(
    res,
    async () => {
      await FriendList.findOneAndUpdate(
        { userId: recipientId },
        {
          $addToSet: { friends: requesterId },
          $pull: { receivedFriendRequests: requesterId },
        },
      );
      await FriendList.findOneAndUpdate(
        { userId: requesterId },
        {
          $addToSet: { friends: recipientId },
          $pull: { sentFriendRequests: recipientId },
        },
      );
    },
    "Friend request accepted.",
  );
};

export const declineFriendRequest = async (req: Request, res: Response) => {
  const recipientId = req.user?._id;
  const { userId: requesterId } = req.params;

  await performFriendAction(
    res,
    async () => {
      await FriendList.findOneAndUpdate(
        { userId: recipientId },
        { $pull: { receivedFriendRequests: requesterId } },
      );
      await FriendList.findOneAndUpdate(
        { userId: requesterId },
        { $pull: { sentFriendRequests: recipientId } },
      );
    },
    "Friend request declined.",
  );
};

export const cancelFriendRequest = async (req: Request, res: Response) => {
  const requesterId = req.user?._id;
  const { userId: recipientId } = req.params;

  await performFriendAction(
    res,
    async () => {
      await FriendList.findOneAndUpdate(
        { userId: requesterId },
        { $pull: { sentFriendRequests: recipientId } },
      );
      await FriendList.findOneAndUpdate(
        { userId: recipientId },
        { $pull: { receivedFriendRequests: requesterId } },
      );
    },
    "Friend request canceled.",
  );
};

export const removeFriend = async (req: Request, res: Response) => {
  const removerId = req.user?._id;
  const { userId: friendToRemoveId } = req.params;

  await performFriendAction(
    res,
    async () => {
      await FriendList.findOneAndUpdate(
        { userId: removerId },
        { $pull: { friends: friendToRemoveId } },
      );

      await FriendList.findOneAndUpdate(
        { userId: friendToRemoveId },
        { $pull: { friends: removerId } },
      );
    },
    "Friend removed successfully.",
  );
};
