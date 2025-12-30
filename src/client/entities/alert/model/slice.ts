import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlertProps } from "@mui/material/Alert";
import type { SnackbarProps } from "@mui/material/Snackbar";

type SnackbarState = SnackbarProps & AlertProps;

const initialState: SnackbarState = {
  open: false,
  message: "",
  severity: "info",
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  autoHideDuration: 5000,
  action: undefined,
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<SnackbarState>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity ?? state.severity;
      state.anchorOrigin = action.payload.anchorOrigin ?? state.anchorOrigin;
      state.autoHideDuration = action.payload.autoHideDuration ?? state.autoHideDuration;
      state.action = action.payload.action;
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.action = undefined;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
