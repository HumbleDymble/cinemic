import { createSlice } from "@reduxjs/toolkit";

export interface IChangePassword {
  
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  
}

export interface ChangePasswordResponse {
  user: {
    password: string;
  };
}

const ChangePasswordState: IChangePassword = {
  
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  
};

export const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState: ChangePasswordState,
  reducers: {
    changePassword: (state, action) => {
      state.oldPassword = action.payload;
      state.newPassword = action.payload;
      state.repeatPassword = action.payload;
    },
  },
});

export const { changePassword } = changePasswordSlice.actions;
