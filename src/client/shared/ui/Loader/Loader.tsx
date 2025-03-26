import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export const Loader = ({
  open = true,
  message = "Loading...",
  fullScreen = true,
}) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...(fullScreen ? {} : { position: "absolute" }),
      }}
      open={open}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
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
