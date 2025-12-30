import type { Watchlist } from "@/entities/watchlist";
import type { Review } from "@/entities/review";
import type { User, UserId } from "@/entities/user";
import { baseApi } from "@/shared/api";
import type { KpMovieId } from "@/entities/media-detail";

export interface MyProfileResponse {
  ratings: {
    titleId: KpMovieId;
    rating: number;
  }[];
  watchlist: Watchlist;
  reviews: Review[];
  friends: User[];
  receivedFriendRequests: User[];
  sentFriendRequests: User[];
  privacy: "public" | "friends" | "private";
}

export interface PublicProfileResponse {
  _id: UserId;
  username: string;
  ratings:
    | {
        titleId: KpMovieId;
        rating: number;
      }[]
    | null;
  watchlist: Watchlist | null;
  reviews: Review[] | null;
  friendshipStatus: "friends" | "request_sent" | "request_received" | "none";
}

type PrivacySetting = "public" | "friends" | "private";

export const userProfileEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<MyProfileResponse, void>({
      query: () => "/user/profile",
      providesTags: [{ type: "UserProfile", id: "ME" }],
    }),

    getPublicProfile: build.query<PublicProfileResponse, UserId>({
      query: (userId) => `/user/profile/${userId}`,
      providesTags: (result, error, userId) => [{ type: "UserProfile", id: userId }],
    }),

    updateProfilePrivacy: build.mutation<void, { privacy: PrivacySetting }>({
      query: (body) => ({
        url: "/user/profile/privacy",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "UserProfile", id: "ME" }],
    }),

    sendFriendRequest: build.mutation<void, UserId>({
      query: (userId) => ({
        url: `/user/friends/request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, userId) => [
        { type: "UserProfile", id: "ME" },
        { type: "UserProfile", id: userId },
      ],
    }),

    acceptFriendRequest: build.mutation<void, UserId>({
      query: (requesterId) => ({
        url: `/user/friends/accept/${requesterId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, requesterId) => [
        { type: "UserProfile", id: "ME" },
        { type: "UserProfile", id: requesterId },
      ],
    }),

    declineFriendRequest: build.mutation<void, UserId>({
      query: (requesterId) => ({
        url: `/user/friends/decline/${requesterId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, requesterId) => [
        { type: "UserProfile", id: "ME" },
        { type: "UserProfile", id: requesterId },
      ],
    }),

    cancelFriendRequest: build.mutation<void, UserId>({
      query: (recipientId) => ({
        url: `/user/friends/cancel/${recipientId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, recipientId) => [
        { type: "UserProfile", id: "ME" },
        { type: "UserProfile", id: recipientId },
      ],
    }),

    removeFriend: build.mutation<void, UserId>({
      query: (userId) => ({
        url: `/user/friends/remove/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, userId) => [
        { type: "UserProfile", id: "ME" },
        { type: "UserProfile", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetPublicProfileQuery,
  useUpdateProfilePrivacyMutation,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
} = userProfileEndpoints;
