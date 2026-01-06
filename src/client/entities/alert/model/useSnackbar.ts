import type { SyntheticEvent } from "react";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import { hideSnackbar } from "./slice";
import { useAppDispatch, useAppSelector } from "@/client/shared/config";

export const useSnackbar = () => {
  const dispatch = useAppDispatch();
  const { open, message, severity, anchorOrigin, autoHideDuration, action } = useAppSelector(
    (state) => state.snackbar,
  );

  const handleClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackbar());
  };

  return {
    open,
    handleClose,
    message,
    severity,
    anchorOrigin,
    autoHideDuration,
    action,
  };
};
