import type { ReviewModeratedParams, ReviewModeratedParamsPayload } from "../model/types";
import type { User } from "@/client/entities/user";
import type { Review, ReviewId } from "@/client/entities/review";
import { baseApi } from "@/client/shared/api";

const moderatorEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    moderatorGetUsers: builder.query<User[], void>({
      query: () => "/moderator/users",
      providesTags: (result) => {
        const tags = [{ type: "User" as const, id: "LIST" }];

        if (result) {
          return [...tags, ...result.map(({ _id }) => ({ type: "User" as const, id: _id }))];
        }
        return tags;
      },
    }),

    moderatorGetReviews: builder.query<
      ReviewModeratedParams[],
      Review["status"] | "all" | undefined
    >({
      query: (status) => {
        if (status === "all") return "/moderator/reviews";
        if (!status) return "/moderator/reviews?status=pending";
        return `/moderator/reviews?status=${status}`;
      },
      providesTags: (result) => {
        const tags = [{ type: "Review" as const, id: "LIST" }];

        if (result) {
          return [
            ...tags,
            ...result.map(({ _id }) => ({
              type: "Review" as const,
              id: _id,
            })),
          ];
        }
        return tags;
      },
    }),

    moderatorManageReview: builder.mutation<ReviewModeratedParams, ReviewModeratedParamsPayload>({
      query: ({ titleId, action, moderatorComments }) => ({
        url: `/moderator/reviews/${titleId}/action`,
        method: "PATCH",
        body: { action, moderatorComments, titleId },
      }),
      invalidatesTags: (result, error, args) => {
        const tags = [
          { type: "Review" as const, id: "LIST" },
          { type: "Review" as const, id: args.titleId },
        ];

        if (result) {
          tags.push({ type: "Review", id: result._id });
        }
        return tags;
      },
    }),

    moderatorDeleteReview: builder.mutation<
      { message: string },
      { reviewId: ReviewId; titleId?: string }
    >({
      query: ({ reviewId }) => ({
        url: `/moderator/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, args) => {
        const tags = [
          { type: "Review" as const, id: args.reviewId },
          { type: "Review" as const, id: "LIST" },
        ];
        if (args.titleId) {
          tags.push({ type: "Review" as const, id: args.titleId });
        }
        return tags;
      },
    }),
  }),
});

export const {
  useModeratorGetUsersQuery,
  useModeratorGetReviewsQuery,
  useModeratorManageReviewMutation,
  useModeratorDeleteReviewMutation,
} = moderatorEndpoints;
