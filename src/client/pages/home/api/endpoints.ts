import type { ListWithMoviesResponseDtoV1_5 } from "@/client/entities/media-detail";
import { baseApi } from "@/client/shared/api";
import { env } from "@/client/shared/config";

interface GetListArgs {
  slug: string;
  limit?: number;
  next?: string;
}

export const listCollectionsEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollection: builder.query<ListWithMoviesResponseDtoV1_5, GetListArgs>({
      query: ({ slug, limit = 10, next }) => ({
        url: `${env.NEXT_PUBLIC_API_V15_GET_LIST_COLLECTIONS}/${slug}`,
        params: {
          limit,
          ...(next && { next }),
        },
      }),
    }),
  }),
});

export const { useGetCollectionQuery } = listCollectionsEndpoints;
