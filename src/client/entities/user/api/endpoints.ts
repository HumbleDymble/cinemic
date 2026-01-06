import { signOut } from "../model/slice";
import type { AuthenticatedUser, LoginForm, RegisterForm } from "../model/types";
import { baseApi } from "@/client/shared/api";

const authEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation<AuthenticatedUser, RegisterForm>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Auth", id: "SESSION" }],
    }),
    signIn: build.mutation<AuthenticatedUser, LoginForm>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Auth", id: "SESSION" }],
    }),
    signOut: build.mutation<void, void>({
      query: () => ({
        url: "/auth/signout",
        method: "DELETE",
        keepUnusedDataFor: 0,
      }),
      invalidatesTags: [{ type: "Auth", id: "SESSION" }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(signOut());
          dispatch(baseApi.util.resetApiState());
        } catch {
          console.error("Logout failed on the server.");
        }
      },
    }),
    handleAuthorization: build.query<AuthenticatedUser, void>({
      query: () => ({
        url: "/auth/session",
      }),
      providesTags: [{ type: "Auth", id: "SESSION" }],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useHandleAuthorizationQuery,
} = authEndpoints;
