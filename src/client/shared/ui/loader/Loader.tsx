"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 1400,
        ...(fullScreen ? {} : { position: "absolute" }),
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <CircularProgress color="inherit" />
        {message != null && (
          <Typography variant="body1" sx={{ marginTop: 2, color: "inherit" }}>
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};
