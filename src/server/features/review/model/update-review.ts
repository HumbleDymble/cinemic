import { Request, Response } from "express";
import { Review } from "@/server/entities/review/index.js";

export const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { text, rating } = req.body;
  const userId = req.user?._id;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Review text cannot be empty." });
  }
  if (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 10)) {
    return res.status(400).json({ message: "Rating must be a number between 1 and 10." });
  }

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only edit your own reviews." });
    }

    if (review.status !== "needs_correction") {
      return res.status(403).json({
        message: "Forbidden: You can only edit reviews that have been flagged for correction.",
      });
    }

    review.text = text;
    if (rating !== undefined) review.rating = rating;

    review.status = "pending";
    review.hasBeenCorrected = true;

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully and is now awaiting re-moderation.",
      review,
    });
  } catch (e) {
    console.error("Error updating review:", e);
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};
