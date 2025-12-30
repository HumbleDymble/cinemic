import { type FormEvent, memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUpdateProfilePrivacyMutation } from "../api/endpoints";
import { showSnackbar } from "@/entities/alert";

type PrivacySetting = "public" | "friends" | "private";

interface Props {
  currentPrivacy: PrivacySetting;
}

export const SettingsPanel = memo(({ currentPrivacy }: Props) => {
  const [updatePrivacy, { isLoading }] = useUpdateProfilePrivacyMutation();
  const [privacy, setPrivacy] = useState(currentPrivacy);

  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setPrivacy(currentPrivacy);
  }, [currentPrivacy]);

  const handleChange = useCallback((event: SelectChangeEvent<PrivacySetting>) => {
    setPrivacy(event.target.value as PrivacySetting);
  }, []);

  const isCorrectPrivacy = privacy !== currentPrivacy;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isCorrectPrivacy) return;

      updatePrivacy({ privacy })
        .unwrap()
        .then(() => {
          showSnackbar({
            open: true,
            security: "success",
            message: t("pages.user-profile.settings.privacy.saved"),
            autoHideDuration: 4000,
          });
        })
        .catch(() => {
          showSnackbar({
            open: true,
            security: "error",
            message: t("pages.user-profile.settings.privacy.saveFailed"),
            autoHideDuration: 4000,
          });
        });
    },
    [isCorrectPrivacy, privacy, t, updatePrivacy],
  );

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
        {t("pages.user-profile.settings.privacy.title")}
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1, color: "text.secondary" }}>
            {t("pages.user-profile.settings.privacy.label")}
          </FormLabel>

          <Select value={privacy} onChange={handleChange}>
            <MenuItem value="public">{t("pages.user-profile.settings.privacy.public")}</MenuItem>
            <MenuItem value="friends">{t("pages.user-profile.settings.privacy.friends")}</MenuItem>
            <MenuItem value="private">{t("pages.user-profile.settings.privacy.private")}</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={isLoading ?? !isCorrectPrivacy}
          fullWidth={isMobile}
        >
          {isLoading
            ? t("pages.user-profile.settings.privacy.saving")
            : t("pages.user-profile.settings.privacy.save")}
        </Button>
      </form>
    </Paper>
  );
});

SettingsPanel.displayName = "SettingsPanel";
