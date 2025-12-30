import { Request, Response } from "express";
import { Review } from "~/entities/review/index.js";

export const moderatorGetReviews = async (req: Request, res: Response) => {
  const { status } = req.query;

  try {
    let matchStage = {};

    if (status && status !== "all") {
      matchStage = { status: status };
    }

    const reviews = await Review.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1 } }],
          as: "author",
        },
      },
      {
        $lookup: {
          from: "reviewsModerated",
          localField: "_id",
          foreignField: "reviewId",
          as: "moderationHistory",
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                localField: "moderatedBy",
                foreignField: "_id",
                pipeline: [{ $project: { username: 1 } }],
                as: "moderatorInfo",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          authorUsername: { $arrayElemAt: ["$author.username", 0] },
          latestModeration: { $arrayElemAt: ["$moderationHistory", 0] },
          moderatorUsername: { $arrayElemAt: ["$moderationHistory.moderatorInfo.username", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          titleId: 1,
          authorId: "$userId",
          authorUsername: { $ifNull: ["$authorUsername", "Unknown User"] },
          review: {
            text: "$text",
            title: "$title",
            rating: "$rating",
            status: "$status",
            previousStatus: "$previousStatus",
            uploadedAt: "$createdAt",
            moderatedAt: "$latestModeration.moderatedAt",
            moderatorComments: "$latestModeration.moderatorComments",
            moderatorUsername: { $ifNull: ["$moderatorUsername", null] },
            hasBeenCorrected: "$hasBeenCorrected",
          },
        },
      },
      { $sort: { "review.uploadedAt": 1 } },
    ]);

    return res.status(200).json(reviews);
  } catch (e) {
    console.error("Error fetching reviews for moderation:", e);
    return res.status(500).json({ message: "Server error fetching reviews." });
  }
};
