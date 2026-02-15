import type { Request, Response } from "express";
import { Review } from "~/entities/review/index.js";

export const rateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?._id.toString();

    const { vote } = req.body;

    if (![1, -1].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote value." });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.userId.toString() === userId) {
      return res.status(403).json({ message: "You cannot vote on your own review." });
    }

    const previousVote = review.votes.get(userId);

    if (previousVote === vote) {
      review.votes.delete(userId);
    } else {
      review.votes.set(userId, vote);
    }

    let likeCount = 0;
    let dislikeCount = 0;

    for (const v of review.votes.values()) {
      if (v === 1) likeCount++;
      if (v === -1) dislikeCount++;
    }

    review.likeCount = likeCount;
    review.dislikeCount = dislikeCount;

    await review.save();

    return res.status(200).json(review);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
