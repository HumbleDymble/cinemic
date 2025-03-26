import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  email: string;
  password: string;
  username: string;
}

export interface UserResponse {
  user: IUser | null;
  accessToken: string | null;
}

export interface UserArg {
  email: string;
  password: string;
}

const AuthState: UserResponse = {
  user: {
    username: "",
    email: "",
    password: "",
  },
  accessToken: "",
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState: AuthState,
  reducers: {
    signUp: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    signIn: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    signOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { signUp, signIn, signOut } = AuthSlice.actions;
