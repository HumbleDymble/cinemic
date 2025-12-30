import type { Image, ImageDocsResponseDtoV1_4, MovieDtoV1_4 } from "../model/kp.types";
import { baseApi } from "@/shared/api";
import { env } from "@/shared/config";
import type { ImdbData } from "../model/imdb.types";

interface MediaDetailsParams {
  id: string | undefined;
}

export interface GetImagesParams {
  movieId: number;
  page?: number;
  limit?: number;
  type?: Image["type"] | Image["type"][];
}

export interface RandomTitleFilters {
  "genres.name"?: string | null;
  year?: string | null;
  "rating.kp"?: string | null;
  "votes.kp"?: string | null;
  type?: string | null;
  limit?: number | null;
}

const mediaDetailsEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMediaDetails: build.query<MovieDtoV1_4, MediaDetailsParams>({
      query: ({ id }) => ({
        url: `${env.API_V14_GET_TITLE}/${id}`,
        timeout: 8000,
      }),
    }),

    getImagesForTitle: build.query<ImageDocsResponseDtoV1_4, GetImagesParams>({
      query: ({ movieId, page = 1, limit = 50, type }) => {
        const params = new URLSearchParams();
        params.append("movieId", String(movieId));
        params.append("page", String(page));
        params.append("limit", String(limit));

        if (Array.isArray(type)) {
          params.append("type", type.join(","));
        } else if (type) {
          params.append("type", type);
        }

        return {
          url: `${env.API_V14_GET_IMAGES_TITLE}`,
          params: params,
          timeout: 8000,
        };
      },
    }),

    getRandomTitle: build.query<MovieDtoV1_4, RandomTitleFilters>({
      query: (filters) => {
        const params: RandomTitleFilters = {};

        if (filters["genres.name"] && filters["genres.name"] !== "Any")
          params["genres.name"] = filters["genres.name"];

        if (filters.year) params.year = filters.year;

        if (filters["rating.kp"]) params["rating.kp"] = filters["rating.kp"];

        if (filters["votes.kp"]) params["votes.kp"] = filters["votes.kp"];

        if (filters.type) params.type = filters.type;

        if (filters.limit) params.limit = filters.limit;

        return {
          url: `${env.API_V14_GET_RANDOM_TITLE}`,
          params: params,
        };
      },
    }),
  }),
});

export const {
  useGetMediaDetailsQuery,
  useGetImagesForTitleQuery,
  useLazyGetImagesForTitleQuery,
  useLazyGetMediaDetailsQuery,
  useLazyGetRandomTitleQuery,
} = mediaDetailsEndpoints;

export const imdbEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getImdbTitle: build.query<ImdbData, { id: string }>({
      query: ({ id }) => `api/title/${id}`,
    }),
  }),
});

export const { useGetImdbTitleQuery, useLazyGetImdbTitleQuery } = imdbEndpoints;
