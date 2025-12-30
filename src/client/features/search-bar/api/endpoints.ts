import type { SearchMovieResponseDtoV1_4 } from "@/entities/media-detail";
import { baseApi } from "@/shared/api";
import { env } from "@/shared/config";

interface SearchParams {
  search: string;
}

const searchEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchMovieResponseDtoV1_4, SearchParams>({
      query: ({ search }) => ({
        url: `${env.API_V14_GET_SEARCH}`,
        params: { query: search },
      }),
    }),
  }),
});

export const { useLazySearchQuery } = searchEndpoints;
