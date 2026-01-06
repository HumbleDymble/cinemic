import type { AllNotificationsResponse, BaseNotification, NotificationId } from "../model/types";
import { baseApi } from "@/client/shared/api";

export const notificationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<AllNotificationsResponse, { page: number; limit?: number }>({
      query: ({ page, limit = 10 }) => ({
        url: "/notifications",
        params: { page, limit },
      }),
      providesTags: (result) => {
        const tags = [{ type: "Notification" as const, id: "LIST" }];
        if (result) {
          return [
            ...tags,
            ...result.notifications.map(({ _id }) => ({
              type: "Notification" as const,
              id: _id,
            })),
          ];
        }
        return tags;
      },
    }),

    getUnread: builder.query<BaseNotification[], void>({
      query: () => "/notifications/unread",
      providesTags: [{ type: "Notification", id: "UNREAD" }],
    }),

    markAsRead: builder.mutation<{ message: string }, NotificationId[]>({
      query: (ids) => ({
        url: "/notifications/read",
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
      async onQueryStarted(ids, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationEndpoints.util.updateQueryData("getUnread", undefined, (draft) => {
            return draft.filter((n) => !ids.includes(n._id));
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteNotification: builder.mutation<{ message: string }, NotificationId>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),

    deleteAllNotifications: builder.mutation<{ message: string }, NotificationId[]>({
      query: (ids) => ({
        url: "/notifications",
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useGetUnreadQuery,
  useGetAllNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationEndpoints;
