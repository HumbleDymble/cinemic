import { Request, Response } from "express";
import { FriendList, User } from "@/server/entities/user/index.js";
import { Rating } from "@/server/entities/rating/index.js";
import { Watchlist } from "@/server/entities/watchlist/index.js";
import { Review } from "@/server/entities/review/index.js";

export const publicProfile = async (req: Request, res: Response) => {
  try {
    const { userId: profileUserId } = req.params;
    const requesterId = req.user?._id?.toString();

    const [profileUser, profileFriendList, requesterFriendList] = await Promise.all([
      User.findById(profileUserId).select("username").lean(),
      FriendList.findOne({ userId: profileUserId }).lean(),
      requesterId ? FriendList.findOne({ userId: requesterId }).lean() : null,
    ]);

    if (!profileUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!profileFriendList) {
      return res.status(404).json({ message: "Profile data not available." });
    }

    const isOwner = requesterId === profileUserId;

    let friendshipStatus = "none";

    const profileFriendsSet = new Set(profileFriendList.friends?.map((id) => id.toString()) ?? []);
    const profileRequestsSet = new Set(
      profileFriendList.receivedFriendRequests?.map((id) => id.toString()) ?? [],
    );

    const isFriend =
      requesterId && requesterFriendList
        ? profileFriendsSet.has(requesterId) &&
          new Set(requesterFriendList.friends?.map((id) => id.toString()) ?? []).has(profileUserId)
        : false;

    if (isFriend) {
      friendshipStatus = "friends";
    } else if (requesterId) {
      if (profileRequestsSet.has(requesterId)) {
        friendshipStatus = "request_sent";
      } else {
        const requesterReceivedRequests = requesterFriendList?.receivedFriendRequests ?? [];
        if (requesterReceivedRequests.some((id) => id.toString() === profileUserId)) {
          friendshipStatus = "request_received";
        }
      }
    }

    if (profileFriendList.privacy === "private" && !isOwner) {
      return res.status(403).json({
        message: "This profile is private.",
        username: profileUser.username,
        friendshipStatus,
      });
    }

    if (profileFriendList.privacy === "friends" && !isOwner && !isFriend) {
      return res.status(403).json({
        message: "This profile is only visible to friends.",
        username: profileUser.username,
        friendshipStatus,
      });
    }

    const [ratings, watchlist, reviews] = await Promise.all([
      Rating.find({ userId: profileUserId }).lean(),
      Watchlist.findOne({ userId: profileUserId }).lean(),
      Review.find({ userId: profileUserId }).lean(),
    ]);

    return res.status(200).json({
      _id: profileUser._id,
      username: profileUser.username,
      ratings,
      watchlist,
      reviews,
      friendshipStatus,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
