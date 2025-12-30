import { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const v14GetTitle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const externalUrl = `${env.V14_GET_TITLE}/${id}`;

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.X_API_KEY,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "External API Error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Error in proxy:", e);
    return res.status(500).json({ message: "Failed to fetch data." });
  }
};
