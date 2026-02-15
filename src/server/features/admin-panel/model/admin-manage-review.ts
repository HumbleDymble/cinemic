import type { Request, Response } from "express";
import { Review } from "~/entities/review/index.js";

export const adminManageReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(reviewId, { $set: req.body }, { new: true });

    if (!review) return res.status(404).json({ message: "Review not found." });

    return res.status(200).json(review);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
