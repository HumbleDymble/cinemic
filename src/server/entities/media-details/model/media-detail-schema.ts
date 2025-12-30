import { model, Schema } from "mongoose";

const mediaDetailSchema = new Schema(
  {
    titleId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "mediaDetails" },
);

export const MediaDetail = model("MediaDetail", mediaDetailSchema);
