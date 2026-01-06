import { baseApi } from "@/client/shared/api";
import type { KpMovieId } from "@/client/entities/media-detail";

interface GetRatingParams {
  titleId?: KpMovieId | null;
}

interface RatingResponse {
  message: string;
}

interface AddRatingParams {
  titleId: KpMovieId;
  rating: number;
}

interface RemoveRatingParams {
  titleId: KpMovieId;
}

interface GetRatingResponse {
  rating: number | null;
}

const ratingEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRating: build.query<GetRatingResponse, GetRatingParams>({
      query: ({ titleId }) => ({
        method: "GET",
        url: `/user/ratings/${titleId}`,
      }),
      providesTags: (result, error, { titleId }) =>
        titleId ? [{ type: "Rating", id: titleId }] : [],
    }),

    addRating: build.mutation<RatingResponse, AddRatingParams>({
      query: ({ titleId, rating }) => ({
        method: "PUT",
        url: `/user/ratings/${titleId}`,
        body: { titleId, rating },
      }),
      invalidatesTags: (result, error, { titleId }) => [
        { type: "Rating", id: titleId },
        { type: "UserProfile", id: "ME" },
      ],
      async onQueryStarted({ titleId, rating }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ratingEndpoints.util.updateQueryData("getRating", { titleId }, (draft) => {
            draft.rating = rating;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    removeRating: build.mutation<RatingResponse, RemoveRatingParams>({
      query: ({ titleId }) => ({
        method: "DELETE",
        url: `/user/ratings/${titleId}`,
        body: { titleId },
      }),
      invalidatesTags: (result, error, { titleId }) => [
        { type: "Rating", id: titleId },
        { type: "UserProfile", id: "ME" },
      ],
      async onQueryStarted({ titleId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ratingEndpoints.util.updateQueryData("getRating", { titleId }, (draft) => {
            draft.rating = null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useAddRatingMutation, useRemoveRatingMutation, useGetRatingQuery } = ratingEndpoints;
