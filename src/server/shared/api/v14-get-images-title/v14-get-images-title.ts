import { Request, Response } from "express";
import { env } from "~/shared/config/index.js";

type Q = string | string[] | undefined;

function parseTypes(typeParam: Q): string[] {
  if (!typeParam) return [];

  const rawParts: string[] = [];

  if (Array.isArray(typeParam)) {
    for (const v of typeParam) rawParts.push(String(v));
  } else {
    rawParts.push(String(typeParam));
  }

  const out: string[] = [];

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          for (const x of arr) {
            const t = String(x).trim();
            if (t) out.push(t);
          }
          continue;
        }
      } catch (e) {
        console.error(e);
      }
    }

    for (const s of trimmed.split(",")) {
      const t = s.trim();
      if (t) out.push(t);
    }
  }

  return Array.from(new Set(out));
}

async function fetchUpstream(params: URLSearchParams) {
  const url = `${env.V14_GET_IMAGES_TITLE}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.X_API_KEY,
    },
  });

  const text = await response.text();
  const json = (() => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  })();

  return { response, text, json };
}

export const v14GetImagesTitle = async (req: Request, res: Response) => {
  try {
    const allowedParams = ["movieId", "limit"] as const;

    const baseParams = new URLSearchParams();

    for (const key of allowedParams) {
      const value = req.query[key] as Q;
      if (value === undefined || value === "") continue;
      baseParams.append(key, Array.isArray(value) ? String(value[0]) : String(value));
    }

    const types = parseTypes(req.query.type as Q);

    const getDocs = (data) => (data && Array.isArray(data.docs) ? data.docs : []);

    if (types.length <= 1) {
      const params = new URLSearchParams(baseParams);
      if (types[0]) params.append("type", types[0]);

      const { response, text, json } = await fetchUpstream(params);

      if (!response.ok) {
        console.error("API Error:", text);
        return res.status(response.status).json({ message: "External API Error", details: text });
      }

      const docs = getDocs(json);
      if (docs.length > 0) return res.status(200).json(json);

      return res.status(404).json({ message: "No images found with these filters." });
    }

    {
      const { response, text, json } = await fetchUpstream(new URLSearchParams(baseParams));

      if (!response.ok) {
        console.error("API Error:", text);
        return res.status(response.status).json({ message: "External API Error", details: text });
      }

      const docs = getDocs(json);
      const filtered = docs.filter((d) => types.includes(String(d.type)));

      if (filtered.length > 0) {
        return res.status(200).json({ ...json, docs: filtered });
      }
    }

    const mergedByUrl = new Map<string, string>();
    let lastMeta = null;

    for (const t of types) {
      const params = new URLSearchParams(baseParams);
      params.append("type", t);

      const { response, text, json } = await fetchUpstream(params);

      if (!response.ok) {
        console.error("API Error:", text);
        return res.status(response.status).json({ message: "External API Error", details: text });
      }

      lastMeta = json;
      for (const d of getDocs(json)) {
        const url = d?.url || d?.previewUrl || JSON.stringify(d);
        if (!mergedByUrl.has(url)) mergedByUrl.set(url, d);
      }
    }

    const merged = Array.from(mergedByUrl.values());
    if (merged.length > 0) {
      return res.status(200).json({ ...(lastMeta ?? {}), docs: merged });
    }

    return res.status(404).json({ message: "No images found with these filters." });
  } catch (e) {
    console.error("Proxy Error:", e);
    return res.status(500).json({ message: "Server Error" });
  }
};
