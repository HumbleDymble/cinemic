import { Request, Response } from "express";
import { Rating } from "~/entities/rating/index.js";

export const removeRating = async (req: Request, res: Response) => {
  try {
    const { titleId } = req.body;

    const userId = req.user?._id;

    await Rating.deleteOne({ userId, titleId });

    return res.status(200).json({ message: "Rating deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
