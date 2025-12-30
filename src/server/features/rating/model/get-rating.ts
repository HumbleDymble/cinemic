import { Request, Response } from "express";
import { Rating } from "~/entities/rating/index.js";

export const getRating = async (req: Request, res: Response) => {
  try {
    const { titleId } = req.params;
    const userId = req.user?._id;

    const ratingDoc = await Rating.findOne({ userId, titleId }).lean();

    return res.status(200).json({ rating: ratingDoc ? ratingDoc.rating : null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
