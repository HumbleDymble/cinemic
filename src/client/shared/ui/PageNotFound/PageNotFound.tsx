import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Container, Stack, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

export const PageNotFound = () => {
  const [countdown, setCountdown] = React.useState(3);
  const navigate = useNavigate();
  const theme = useTheme();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          navigate(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: theme.spacing(3),
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 100,
          color: theme.palette.error.main,
          marginBottom: theme.spacing(2),
        }}
      />

      <Typography variant="h4" component="h1" gutterBottom color="text.primary">
        Oops! Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: theme.spacing(2) }}
      >
        Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
      </Typography>

      <Stack direction="row" spacing={2} sx={{ marginTop: theme.spacing(2) }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
        >
          Go to Home
        </Button>

        <Button variant="outlined" color="secondary" onClick={handleGoBack}>
          Go Back
        </Button>
      </Stack>
    </Container>
  );
};
