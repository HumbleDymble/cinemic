import type { ListWithMoviesResponseDtoV1_5 } from "@/entities/media-detail";
import { baseApi } from "@/shared/api";
import { env } from "@/shared/config";

interface GetListArgs {
  slug: string;
  limit?: number;
  next?: string;
}

export const listCollectionsEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollection: builder.query<ListWithMoviesResponseDtoV1_5, GetListArgs>({
      query: ({ slug, limit = 10, next }) => ({
        url: `${env.API_V15_GET_LIST_COLLECTIONS}/${slug}`,
        params: {
          limit,
          ...(next && { next }),
        },
      }),
    }),
  }),
});

export const { useGetCollectionQuery } = listCollectionsEndpoints;
