import { Request, Response } from "express";
import { Rating } from "~/entities/rating/index.js";
import { Watchlist } from "~/entities/watchlist/index.js";
import { Review } from "~/entities/review/index.js";
import { FriendList } from "~/entities/user/index.js";

export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const [ratings, watchlist, reviews, friendList] = await Promise.all([
      Rating.find({ userId }),
      Watchlist.findOne({ userId }),
      Review.find({ userId }),
      FriendList.findOne({ userId }).populate([
        { path: "friends", select: "username" },
        { path: "sentFriendRequests", select: "username" },
        { path: "receivedFriendRequests", select: "username" },
      ]),
    ]);

    return res.status(200).json({
      ratings,
      watchlist,
      reviews,
      friends: friendList?.friends,
      privacy: friendList?.privacy,
      receivedFriendRequests: friendList?.receivedFriendRequests,
      sentFriendRequests: friendList?.sentFriendRequests,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
