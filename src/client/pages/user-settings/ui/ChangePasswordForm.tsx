import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useChangePasswordMutation } from "../api/endpoints";

export const ChangePasswordForm = () => {
  const { t } = useTranslation();

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [updatePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatePassword({
      oldPassword: password.oldPassword,
      newPassword: password.newPassword,
      repeatPassword: password.repeatPassword,
    })
      .unwrap()
      .then(() => {
        setPassword({ oldPassword: "", newPassword: "", repeatPassword: "" });
      });
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="oldPassword"
          label={t("pages.user-settings.settings.password.old")}
          type="password"
          id="oldPassword"
          autoComplete="current-password"
          onChange={handleChange}
          value={password.oldPassword}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label={t("pages.user-settings.settings.password.new")}
          type="password"
          id="newPassword"
          autoComplete="new-password"
          onChange={handleChange}
          value={password.newPassword}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="repeatPassword"
          label={t("pages.user-settings.settings.password.repeat")}
          type="password"
          id="repeatPassword"
          autoComplete="new-password"
          onChange={handleChange}
          value={password.repeatPassword}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {t("pages.user-settings.settings.password.confirm")}
        </Button>
      </Box>
    </Grid>
  );
};
