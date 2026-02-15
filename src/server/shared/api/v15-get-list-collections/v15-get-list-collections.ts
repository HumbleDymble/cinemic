import type { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const v15GetListCollections = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { limit, next } = req.query;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const params = new URLSearchParams();

    if (limit) params.append("limit", String(limit));
    if (next) params.append("next", String(next));

    const apiUrl = `${env.V15_GET_LIST_COLLECTIONS}/${slug}?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.X_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ message: "External API Error", details: errorText });
    }

    const data = await response.json();

    if (data?.slug || data?.movies) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Collection not found." });
    }
  } catch (e) {
    console.error("Proxy Error:", e);
    return res.status(500).json({ message: "Server Error" });
  }
};
