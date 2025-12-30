import { createSlice } from "@reduxjs/toolkit";
import type { AuthenticatedUser } from "./types";

const initialState: AuthenticatedUser = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    signUp: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    signOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { signIn, signUp, signOut } = authSlice.actions;
