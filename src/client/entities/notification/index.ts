export {
  notificationEndpoints,
  useGetUnreadQuery,
  useGetAllNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "./api/endpoints";
export type { NotificationId, BaseNotification, AllNotificationsResponse } from "./model/types";
