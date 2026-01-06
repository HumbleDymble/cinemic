import { Request, Response } from "express";
import { Watchlist } from "@/server/entities/watchlist/index.js";

export const deleteFromWatchlist = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params?.titleId);
    const userId = req.user?._id;

    const foundUser = await Watchlist.findOne({ userId });
    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized: User not found." });
    }

    const updatedUser = await Watchlist.findOneAndUpdate(
      { userId },
      { $pull: { watchlist: id } },
      { new: true },
    ).lean();

    return res.status(200).json({ watchlist: updatedUser?.watchlist });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};
