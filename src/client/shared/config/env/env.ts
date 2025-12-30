import * as v from "valibot";

const envSchema = v.object({
  API_IMDB_GET_SEARCH: v.string(),
  API_IMDB_GET_TITLE: v.string(),
  API_V14_GET_SEARCH: v.string(),
  API_V14_GET_TITLE: v.string(),
  API_V14_GET_RANDOM_TITLE: v.string(),
  API_V14_GET_IMAGES_TITLE: v.string(),
  API_V14_GET_REVIEW: v.string(),
  API_V15_GET_LIST_COLLECTIONS: v.string(),
  SERVER_URL: v.string(),
});

const clientEnvObject = {
  API_IMDB_GET_SEARCH: process.env.API_IMDB_GET_SEARCH,
  API_IMDB_GET_TITLE: process.env.API_IMDB_GET_TITLE,
  API_V14_GET_SEARCH: process.env.API_V14_GET_SEARCH,
  API_V14_GET_TITLE: process.env.API_V14_GET_TITLE,
  API_V14_GET_RANDOM_TITLE: process.env.API_V14_GET_RANDOM_TITLE,
  API_V14_GET_IMAGES_TITLE: process.env.API_V14_GET_IMAGES_TITLE,
  API_V14_GET_REVIEW: process.env.API_V14_GET_REVIEW,
  API_V15_GET_LIST_COLLECTIONS: process.env.API_V15_GET_LIST_COLLECTIONS,
  SERVER_URL: process.env.SERVER_URL,
};

const result = v.safeParse(envSchema, clientEnvObject);

if (!result.success) {
  console.error("❌ Invalid client-side environment variables:", result.issues);
  throw new Error("Client environment configuration is invalid. Check the console for details.");
}

export const env = result.output;
