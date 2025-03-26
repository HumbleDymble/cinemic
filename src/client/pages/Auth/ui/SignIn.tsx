import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/shared/api/api";
import { RootState, useAppDispatch, useAppSelector } from "@/app/store/store";
import { signIn } from "../model/authSlice";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  Button,
  Container,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFetchCookies } from "@/pages/Auth/model/useFetchCookies";

export const SignIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [login] = api.useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchCookies = useFetchCookies();

  const { uid, refreshToken } = useAppSelector(
    (state: RootState) => state.getCookies,
  );

  const isMobile = useMediaQuery("(max-width:600px)");

  const changeHandlerEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const changeHandlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      dispatch(signIn(user));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  React.useEffect(() => {
    fetchCookies();
  }, []);

  React.useEffect(() => {
    if (uid || refreshToken) {
      navigate("/");
    }
  }, [uid, refreshToken, navigate]);

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: isMobile ? 6 : 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? 2 : 4,
          boxShadow: isMobile ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: isMobile ? "transparent" : "white",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={changeHandlerEmail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={changeHandlerPassword}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="space-between">
            <Grid>
              <Link to="#" style={{ textDecoration: "none", color: "blue" }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid>
              <Link
                to="/user/signup"
                style={{ textDecoration: "none", color: "blue" }}
              >
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
