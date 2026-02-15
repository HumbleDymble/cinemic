import type { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const v14GetReview = async (req: Request, res: Response) => {
  try {
    const { page, limit, movieId } = req.query;

    if (!movieId) {
      return res.status(400).json({ message: "movieId query parameter is required." });
    }

    const params = new URLSearchParams();
    params.append("movieId", String(movieId));
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const response = await fetch(`${env.V14_GET_REVIEW}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.X_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("External API Error:", data);
      return res.status(response.status).json({ message: "External API Error", details: data });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error("Proxy Server Error:", e);
    return res.status(500).json({ message: "Server Error" });
  }
};
