import "client-only";
import * as v from "valibot";

const envSchema = v.object({
  NEXT_PUBLIC_API_IMDB_GET_SEARCH: v.string(),
  NEXT_PUBLIC_API_IMDB_GET_TITLE: v.string(),
  NEXT_PUBLIC_API_V14_GET_SEARCH: v.string(),
  NEXT_PUBLIC_API_V14_GET_TITLE: v.string(),
  NEXT_PUBLIC_API_V14_GET_RANDOM_TITLE: v.string(),
  NEXT_PUBLIC_API_V14_GET_IMAGES_TITLE: v.string(),
  NEXT_PUBLIC_API_V14_GET_REVIEW: v.string(),
  NEXT_PUBLIC_API_V15_GET_LIST_COLLECTIONS: v.string(),
  NEXT_PUBLIC_SERVER_URL: v.string(),
});

const clientEnvObject = {
  NEXT_PUBLIC_API_IMDB_GET_SEARCH: process.env.NEXT_PUBLIC_API_IMDB_GET_SEARCH,
  NEXT_PUBLIC_API_IMDB_GET_TITLE: process.env.NEXT_PUBLIC_API_IMDB_GET_TITLE,
  NEXT_PUBLIC_API_V14_GET_SEARCH: process.env.NEXT_PUBLIC_API_V14_GET_SEARCH,
  NEXT_PUBLIC_API_V14_GET_TITLE: process.env.NEXT_PUBLIC_API_V14_GET_TITLE,
  NEXT_PUBLIC_API_V14_GET_RANDOM_TITLE: process.env.NEXT_PUBLIC_API_V14_GET_RANDOM_TITLE,
  NEXT_PUBLIC_API_V14_GET_IMAGES_TITLE: process.env.NEXT_PUBLIC_API_V14_GET_IMAGES_TITLE,
  NEXT_PUBLIC_API_V14_GET_REVIEW: process.env.NEXT_PUBLIC_API_V14_GET_REVIEW,
  NEXT_PUBLIC_API_V15_GET_LIST_COLLECTIONS: process.env.NEXT_PUBLIC_API_V15_GET_LIST_COLLECTIONS,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
};

const result = v.safeParse(envSchema, clientEnvObject);

if (!result.success) {
  console.error("❌ Invalid client-side environment variables:", result.issues);
  throw new Error("Client environment configuration is invalid. Check the console for details.");
}

export const env = result.output;
