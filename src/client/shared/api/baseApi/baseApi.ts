import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/client/shared/config";

const base = fetchBaseQuery({
  baseUrl: `${env.NEXT_PUBLIC_SERVER_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: base,
  tagTypes: [
    "Auth",
    "User",
    "UserProfile",
    "Notification",
    "Watchlist",
    "Rating",
    "Review",
    "ExternalReview",
  ],
  endpoints: () => ({}),
});
