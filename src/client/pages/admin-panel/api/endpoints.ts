import type { User, UserId } from "@/entities/user";
import type { Review, ReviewId } from "@/entities/review";
import type { KpMovieId } from "@/entities/media-detail";
import { baseApi } from "@/shared/api";

export interface AdminNotificationPayload {
  userId: UserId;
  type: string;
  title: string;
  message: string;
}

export interface ReviewParams {
  _id: ReviewId;
  titleId: KpMovieId;
  authorId: UserId;
  authorUsername: string;
  review: Review;
  hasBeenCorrected: boolean;
}

export const adminEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      providesTags: (result) => {
        const tags = [{ type: "User" as const, id: "LIST" }];

        if (result) {
          return [...tags, ...result.map(({ _id }) => ({ type: "User" as const, id: _id }))];
        }
        return tags;
      },
    }),

    adminSendNotification: builder.mutation<{ message: string }, AdminNotificationPayload>({
      query: (payload) => ({
        url: "/admin/notifications/send",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),

    adminGetReviews: builder.query<ReviewParams[], Review["status"] | "all" | undefined>({
      query: (status) => {
        if (status === "all") return "/admin/reviews";
        if (!status) return "/admin/reviews?status=pending";
        return `/admin/reviews?status=${status}`;
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

    updateUserRole: builder.mutation<User, { userId: UserId; role: string | null }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (res, err, args) => [
        { type: "User", id: args.userId },
        { type: "User", id: "LIST" },
      ],
    }),

    updateUserBan: builder.mutation<User, { userId: UserId; banUntil?: string | null }>({
      query: ({ userId, banUntil }) => ({
        url: `/admin/users/${userId}/ban`,
        method: "PATCH",
        body: { banUntil },
      }),
      invalidatesTags: (res, err, args) => [
        { type: "User", id: args.userId },
        { type: "User", id: "LIST" },
      ],
    }),

    updateReviewAsAdmin: builder.mutation<Review, { reviewId: ReviewId; payload: Partial<Review> }>(
      {
        query: ({ reviewId, payload }) => ({
          url: `/admin/reviews/${reviewId}`,
          method: "PATCH",
          body: payload,
        }),
        invalidatesTags: (res, err, args) => [
          { type: "Review", id: args.reviewId },
          { type: "Review", id: "LIST" },
        ],
      },
    ),
  }),
});
export const {
  useAdminSendNotificationMutation,
  useAdminGetUsersQuery,
  useAdminGetReviewsQuery,
  useUpdateUserRoleMutation,
  useUpdateUserBanMutation,
  useUpdateReviewAsAdminMutation,
} = adminEndpoints;
