import { Request, Response } from "express";
import { MediaDetail } from "@/server/entities/media-details/index.js";
import { Review } from "@/server/entities/review/index.js";

const validateInput = ({ titleId, title, text, rating }) => {
  if (!titleId || !title || !text)
    return { status: 400, message: "titleId, title and text required" };
  if (rating !== undefined && (rating < 1 || rating > 10))
    return { status: 400, message: "rating must be 1 to 10" };
  return null;
};

const ensureTitle = async (name) => {
  let doc = await MediaDetail.findOne({ titleId: name });
  if (doc) return doc;

  doc = await MediaDetail.findOneAndUpdate(
    { titleId: name },
    { $setOnInsert: { titleId: name } },
    { upsert: true, new: true },
  );
  return doc;
};

export const addReview = async (req: Request, res: Response) => {
  const err = validateInput(req.body);
  if (err) return res.status(err.status).json({ message: err.message });

  const { titleId, title, text, rating } = req.body;
  const userId = req.user?._id;

  try {
    const foundReview = await Review.findOne({ userId, titleId });

    if (foundReview) {
      return res.status(409).json({ message: "You have already reviewed this title." });
    }

    const ttl = await ensureTitle(titleId);
    if (!ttl) {
      return res.status(404).json({ message: "Title not found in external API" });
    }

    await Review.create({
      userId,
      titleId,
      title,
      text,
      rating,
      status: "pending",
      votes: {},
    });

    return res.status(201).json({ message: "Review submitted, awaiting moderation" });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(409).json({ message: "You already have a review for this title." });
    }
    return res.status(500).json({ message: e.message || "Internal Server Error" });
  }
};
