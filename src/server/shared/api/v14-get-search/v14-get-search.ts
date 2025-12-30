import { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const v14GetSearch = async (req: Request, res: Response) => {
  try {
    const rawQuery = req.query.query;
    const searchQuery = Array.isArray(rawQuery) ? rawQuery[0]?.toString() : rawQuery?.toString();

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const externalUrl = new URL(env.V14_GET_SEARCH);
    externalUrl.searchParams.append("query", searchQuery);

    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.X_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`External API Error: ${response.status}`);
      return res.status(response.status).json({ message: "External API Error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in proxy:", e);
    return res.status(500).json({ message: "Failed to fetch data." });
  }
};
