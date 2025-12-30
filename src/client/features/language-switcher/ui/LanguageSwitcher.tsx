import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const setLng = (lng: "en" | "ru") => {
    void i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <ButtonGroup size="small" variant="outlined">
      <Button
        onClick={() => setLng("en")}
        variant={i18n.resolvedLanguage === "en" ? "contained" : "outlined"}
      >
        EN
      </Button>
      <Button
        onClick={() => setLng("ru")}
        variant={i18n.resolvedLanguage === "ru" ? "contained" : "outlined"}
      >
        RU
      </Button>
    </ButtonGroup>
  );
};
