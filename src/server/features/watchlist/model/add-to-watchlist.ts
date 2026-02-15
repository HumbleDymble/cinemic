import type { Request, Response } from "express";
import { Watchlist } from "~/entities/watchlist/index.js";

export const addToWatchlist = async (req: Request, res: Response) => {
  const id = Number(req.params?.titleId);
  const userId = req.user?._id;

  try {
    if (!id) {
      return res.status(400).json({ message: "Item ID is required in the request body." });
    }

    const foundUser = await Watchlist.findOne({ userId });

    if (!foundUser) {
      return res.status(404).json({ message: "User associated with this session not found." });
    }

    const updatedUser = await Watchlist.findOneAndUpdate(
      { userId },
      { $addToSet: { watchlist: id } },
      { new: true },
    ).lean();

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update watchlist due to a server issue." });
    }
    return res.status(200).json({ watchlist: updatedUser.watchlist });
  } catch (e) {
    console.error("Error modifying watchlist:", e);
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.clearCookie("deviceId", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(403).json({ message: "Invalid or expired session. Please sign in again." });
    }
    return res.status(500).json({ message: "An error occurred while modifying your watchlist." });
  }
};
