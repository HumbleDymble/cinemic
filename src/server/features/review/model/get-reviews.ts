import { Request, Response } from "express";
import { Review } from "~/entities/review/index.js";

export const getReviews = async (req: Request, res: Response) => {
  try {
    const titleId = Number(req.params.titleId);

    const currentUserId = req.user._id;

    if (isNaN(titleId)) {
      return res.status(400).json({ message: "Invalid Title ID" });
    }

    const query = {
      titleId: titleId,
      $or: [{ status: "approved" }, { userId: currentUserId }],
    };

    const reviews = await Review.find(query);

    return res.status(200).json({ titleId, reviews });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
};
