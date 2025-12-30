import { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const imdbGetSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const apiUrl = new URL(env.IMDB_GET_SEARCH);
    apiUrl.searchParams.append("query", query as string);

    const apiResponse = await fetch(apiUrl.toString());

    if (!apiResponse.ok) {
      return res
        .status(apiResponse.status)
        .json({ message: "Failed to fetch data from external API." });
    }

    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in proxy:", e);
    return res.status(500).json({ message: "Failed to fetch data." });
  }
};
