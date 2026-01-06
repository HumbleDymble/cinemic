import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useSnackbar } from "../model/useSnackbar";

export const AppSnackbar = () => {
  const { open, handleClose, message, severity, anchorOrigin, autoHideDuration, action } =
    useSnackbar();
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      message={message}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity={severity} action={action}>
        {message}
      </Alert>
    </Snackbar>
  );
};
