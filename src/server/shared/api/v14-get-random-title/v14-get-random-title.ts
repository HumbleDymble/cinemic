import { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const v14GetRandomTitle = async (req: Request, res: Response) => {
  try {
    const params = new URLSearchParams();

    const response = await fetch(`${env.V14_GET_RANDOM_TITLE}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.X_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);

      return res
        .status(response.status)
        .json({ message: "External API Error", details: errorText });
    }

    const data = await response.json();

    if (data?.id) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "No title found with these filters." });
    }
  } catch (e) {
    console.error("Proxy Error:", e);
    return res.status(500).json({ message: "Server Error" });
  }
};
