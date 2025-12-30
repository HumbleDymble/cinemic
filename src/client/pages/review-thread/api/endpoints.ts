import type { Review, ReviewId } from "@/entities/review";
import type {
  KpMovieId,
  Review as KpReview,
  ReviewDocsResponseDtoV1_4,
} from "@/entities/media-detail";
import { baseApi } from "@/shared/api";
import { env } from "@/shared/config";

export type ReviewRaw = Pick<Review, "title" | "text" | "rating">;

export type ReviewRawId = ReviewRaw & Pick<Review, "titleId">;

type AddReviewMutationResponse = Pick<Review, "_id" | "userId"> & {
  message: string;
};

interface ReviewsResponse {
  titleId: KpMovieId;
  reviews: Review[];
}

type UpdateReviewPayload = Pick<Review, "text" | "rating">;

interface UpdateReviewArg {
  reviewId: ReviewId;
  payload: UpdateReviewPayload;
}

interface VoteOnReviewArg {
  reviewId: ReviewId;
  vote: 1 | -1;
}

const reviewThreadEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovieReviews: builder.query<ReviewsResponse, KpMovieId>({
      query: (titleId) => `/${titleId}/review-thread`,
      providesTags: (result, _error, titleId) => {
        const tags = [{ type: "Review" as const, id: titleId }];

        if (result?.reviews) {
          return [
            ...tags,
            ...result.reviews.map(({ _id }) => ({ type: "Review" as const, id: _id })),
          ];
        }
        return tags;
      },
    }),

    getExternalReviews: builder.query<
      ReviewDocsResponseDtoV1_4,
      { page: number; limit: number; movieId: KpMovieId; type?: KpReview["type"] }
    >({
      query: ({ page = 1, limit = 10, movieId }) => ({
        url: `${env.API_V14_GET_REVIEW}`,
        params: { page, limit, movieId },
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        `reviewsForMovie/${queryArgs.movieId}/page-${queryArgs.page}`,
      merge: (currentCache, newItems) => {
        currentCache.docs.push(...newItems.docs);
        currentCache.page = newItems.page;
        currentCache.pages = newItems.pages;
        currentCache.total = newItems.total;
      },
      providesTags: (_result, _error, { movieId }) => [{ type: "ExternalReview", id: movieId }],
    }),

    addReview: builder.mutation<AddReviewMutationResponse, ReviewRawId>({
      query: (payload) => ({
        url: "/review-thread",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_res, _err, args) => [{ type: "Review", id: args.titleId }],
    }),

    updateReview: builder.mutation<Review, UpdateReviewArg>({
      query: ({ reviewId, payload }) => ({
        url: `/review-thread/${reviewId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_res, _err, args) => [{ type: "Review", id: args.reviewId }],
    }),

    voteOnReview: builder.mutation<Review, VoteOnReviewArg>({
      query: ({ reviewId, vote }) => ({
        url: `/review-thread/${reviewId}/vote`,
        method: "POST",
        body: { vote },
      }),
      invalidatesTags: (_res, _err, args) => [{ type: "Review", id: args.reviewId }],
    }),
  }),
});

export const {
  useGetMovieReviewsQuery,
  useGetExternalReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useVoteOnReviewMutation,
} = reviewThreadEndpoints;
