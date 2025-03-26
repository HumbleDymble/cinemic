import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser, UserArg, UserResponse } from "@/pages/Auth/model/authSlice";

const getCookie = (name: string | null) => {
  const matches = name?.match(new RegExp(/(?<=accessToken=)[^\s]+/gm));
  return matches ? matches.join("") : undefined;
};

export const token = getCookie(document.cookie);

const base = fetchBaseQuery({
  baseUrl: `${process.env.SERVER_URL}`,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// const baseQueryWithReAuth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   const result = await base(args, api, extraOptions);
//   if (result.error && result.error.status === 401) {
// try to get a new token
// await base("/refresh", api, extraOptions);
// if (refreshResult) {
//   // store the new token
//   api.dispatch(signIn({ ...refreshResult }));
//   // retry the initial query
// result = await base(args, api, extraOptions);
// } else {
//   api.dispatch(signOut());
// }
//   }
//   return result;
// };

export const api = createApi({
  reducerPath: "api",
  baseQuery: base,
  endpoints: (build) => ({
    register: build.mutation<UserResponse, IUser>({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: build.mutation<UserResponse, UserArg>({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    checkAuth: build.query<UserResponse, void>({
      query: () => ({
        url: "/refresh",
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",        
      }),
    }),
    userProfile: build.mutation({
      query: (credentials) => ({
        url: "/change-password",
        method: "PUT",
        body: credentials,
      }),
    }),
    watchlist: build.mutation({
      query: (credentials) => ({
        url: "/watchlist",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
