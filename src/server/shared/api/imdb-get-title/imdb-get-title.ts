import type { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const imdbGetTitle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await fetch(`${env.IMDB_GET_TITLE}/${id}`)
      .then((data) => data.json())
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((e) => console.log(e));
  } catch (e) {
    console.error("Error in proxy:", e);
    return res.status(500).json({ message: "Failed to fetch data." });
  }
};
