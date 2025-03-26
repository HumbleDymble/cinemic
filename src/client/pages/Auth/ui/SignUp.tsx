import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../model/authSlice";
import { api } from "@/shared/api/api";
import { RootState, useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  Button,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFetchCookies } from "@/pages/Auth/model/useFetchCookies";

export const SignUp = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const dispatch = useAppDispatch();
  const [register] = api.useRegisterMutation();
  const navigate = useNavigate();
  const fetchCookies = useFetchCookies();
  const { uid, refreshToken } = useAppSelector(
    (state: RootState) => state.getCookies,
  );

  React.useEffect(() => {
    fetchCookies();
  }, []);

  React.useEffect(() => {
    if (uid || refreshToken) {
      navigate("/");
    }
  }, [uid, refreshToken, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register({ email, password, username }).unwrap();
      dispatch(signUp(user));
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="space-between">
            <Grid>
              <Link to="#">Forgot password?</Link>
            </Grid>
            <Grid>
              <Typography variant="body2">
                Have an account? <Link to="/user/signin">Sign In</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
