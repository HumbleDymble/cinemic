import { baseApi } from "@/client/shared/api";

interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

interface ChangeUsernameRequest {
  newUsername: string;
}

interface ChangeUsernameResponse {
  message: string;
  username: string;
}

const userSettingsEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<ChangePasswordResponse, ChangePassword>({
      query: (credentials) => ({
        url: "/auth/password",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Auth", id: "SESSION" }],
    }),
    changeUsername: build.mutation<ChangeUsernameResponse, ChangeUsernameRequest>({
      query: (body) => ({
        url: "/auth/username",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Auth", id: "SESSION" }, { type: "UserProfile" }, { type: "User" }],
    }),
  }),
});

export const { useChangePasswordMutation, useChangeUsernameMutation } = userSettingsEndpoints;
