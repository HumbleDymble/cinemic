import type { Request, Response } from "express";
import { pushNotifications } from "~/features/user-notification/index.js";
import { User } from "~/entities/user/index.js";
import { Review } from "~/entities/review/index.js";
import { ReviewModerated } from "~/entities/moderator/index.js";

const getNotificationDetails = (status: string) => {
  switch (status) {
    case "approved":
      return {
        title: "Your review was approved!",
        message: "Congratulations! Your review is now live.",
      };
    case "rejected":
      return {
        title: "Your review was rejected",
        message:
          "Unfortunately, your review did not meet our guidelines. See comments for details.",
      };
    case "needs_correction":
      return {
        title: "Your review needs correction",
        message: "A moderator has requested changes to your review. Please see their comments.",
      };
    default:
      return {
        title: "Your review has been updated",
        message: "A moderator has updated the status of your review.",
      };
  }
};

export const moderatorManageReview = async (req: Request, res: Response) => {
  const { action, moderatorComments = "", titleId } = req.body;

  const moderatorId = req.user?._id;

  if (!moderatorId) {
    return res.status(401).json({ message: "Unauthenticated." });
  }

  const ACTION_TO_STATUS = {
    approve: "approved",
    reject: "rejected",
    needs_correction: "needs_correction",
  };

  const newStatus = ACTION_TO_STATUS[action];
  if (!newStatus) {
    return res.status(400).json({ message: "Invalid moderation action." });
  }

  if (["rejected", "needs_correction"].includes(newStatus) && !moderatorComments.trim()) {
    return res.status(400).json({ message: "Moderator comments are required for this action." });
  }

  try {
    const review = await Review.findOne({ titleId });
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const prevStatus = review.status;

    review.status = newStatus;
    review.previousStatus = prevStatus;

    await review.save();

    await ReviewModerated.create({
      reviewId: review._id,
      status: newStatus,
      previousStatus: prevStatus,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
      moderatorComments: newStatus === "approve" ? undefined : moderatorComments.trim(),
    });

    const io = req.app.get("io");
    if (io) {
      const { title, message } = getNotificationDetails(newStatus);

      const notificationPayload = {
        sender: moderatorId,
        title,
        message,
        titleId,
        reviewId: review._id,
        newStatus: newStatus,
        moderatorComments: newStatus === "approve" ? undefined : moderatorComments.trim(),
      };

      await pushNotifications(
        {
          userId: review.userId.toString(),
          type: "review",
          payload: notificationPayload,
        },
        io,
      );
    }

    const author = await User.findById(review.userId).select("username");

    return res.status(200).json({
      message: `Review successfully ${newStatus}.`,
      review: {
        _id: review._id.toString(),
        titleId,
        authorId: review.userId.toString(),
        authorUsername: author ? author.username : "Unknown User",
        status: review.status,
        previousStatus: review.previousStatus,
      },
    });
  } catch (e) {
    console.error("Error during review moderation:", e);
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};
