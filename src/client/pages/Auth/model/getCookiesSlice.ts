import { createSlice } from "@reduxjs/toolkit";

interface Props {
  refreshToken: string | undefined;
  uid: string | undefined;
}

const State: Props = {
  refreshToken: "",
  uid: "",
};

export const getCookiesSlice = createSlice({
  name: "123",
  initialState: State,
  reducers: {
    getCookies: (state, action) => {
      const { refreshToken, uid } = action.payload;
      state.refreshToken = refreshToken;
      state.uid = uid;
    },
  },
});

export const { getCookies } = getCookiesSlice.actions;
