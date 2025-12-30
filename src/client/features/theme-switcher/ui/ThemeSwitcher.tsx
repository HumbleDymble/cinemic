import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { toggleTheme } from "../model/slice";
import { useAppDispatch, useAppSelector } from "@/shared/config";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  const tooltipTitle =
    mode === "light"
      ? t("features.theme-switcher.switch_to_dark")
      : t("features.theme-switcher.switch_to_light");

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};
