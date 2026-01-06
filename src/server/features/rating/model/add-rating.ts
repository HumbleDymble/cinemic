import { Request, Response } from "express";
import { Rating } from "@/server/entities/rating/index.js";

export const addRating = async (req: Request, res: Response) => {
  try {
    const { titleId, rating } = req.body;
    const userId = req.user?._id;

    await Rating.updateOne({ userId, titleId }, { $set: { rating } }, { upsert: true });

    return res.status(200).json({ message: "Rating saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
