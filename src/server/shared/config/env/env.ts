import * as v from "valibot";

const IntFromString = v.pipe(v.string(), v.transform(Number), v.integer());

const envSchema = v.object({
  CLIENT_PORT: IntFromString,
  SERVER_PORT: IntFromString,
  SECRET_ACCESS_MAX_AGE: IntFromString,
  SECRET_REFRESH_MAX_AGE: IntFromString,

  CLIENT_URL: v.string(),
  IMDB_GET_SEARCH: v.string(),
  IMDB_GET_TITLE: v.string(),
  X_API_KEY: v.string(),
  V14_GET_SEARCH: v.string(),
  V14_GET_TITLE: v.string(),
  V14_GET_RANDOM_TITLE: v.string(),
  V14_GET_IMAGES_TITLE: v.string(),
  V14_GET_REVIEW: v.string(),
  V15_GET_LIST_COLLECTIONS: v.string(),
  SERVER_URL: v.string(),
  DB_CONNECT: v.string(),
  SECRET_ACCESS: v.string(),
  SECRET_REFRESH: v.string(),
});

const result = v.safeParse(envSchema, process.env);

if (!result.success) {
  console.error("❌ Invalid server-side environment variables:", result.issues);
  throw new Error("Server environment configuration is invalid. Check the console for details.");
}

export const env = result.output;
