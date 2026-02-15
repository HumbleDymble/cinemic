import type { Request, Response } from "express";
import { Review } from "~/entities/review/index.js";

export const moderatorDeleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    if (reviewId) {
      await Review.findOneAndDelete({ _id: reviewId });
      return res.status(200).json({ message: "Review deleted successfully." });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
