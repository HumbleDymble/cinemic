import type { Request, Response } from "express";
import { Watchlist } from "~/entities/watchlist/index.js";

export const getWatchlist = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const foundUser = await Watchlist.findOne({ userId }).select("watchlist").lean();

    if (!foundUser) {
      await Watchlist.create({ userId, watchlist: [] });
      return res.status(200).json({ watchlist: [] });
    }

    return res.status(200).json({ watchlist: foundUser.watchlist });
  } catch (e) {
    console.error("Error fetching watchlist:", e);
    return res.status(500).json({ message: "An error occurred while fetching your watchlist." });
  }
};
