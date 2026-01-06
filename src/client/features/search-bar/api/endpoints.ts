import type { SearchMovieResponseDtoV1_4 } from "@/client/entities/media-detail";
import { baseApi } from "@/client/shared/api";
import { env } from "@/client/shared/config";

interface SearchParams {
  search: string;
}

const searchEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchMovieResponseDtoV1_4, SearchParams>({
      query: ({ search }) => ({
        url: `${env.NEXT_PUBLIC_API_V14_GET_SEARCH}`,
        params: { query: search },
      }),
    }),
  }),
});

export const { useLazySearchQuery } = searchEndpoints;
