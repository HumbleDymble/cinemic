import type { ReactNode } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface Props {
  open: boolean;
  message?: ReactNode;
  fullScreen?: boolean;
}

export const Loader = ({ open, message, fullScreen }: Props) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...(fullScreen ? {} : { position: "absolute" }),
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <CircularProgress color="inherit" />
        <Typography
          variant="body1"
          sx={{
            marginTop: 2,
            color: "inherit",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};
