"use client";

import { type FormEvent, memo } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { type GameState, type HistoryItem } from "../model/useTitleGuesser";
import { type Image } from "@/client/entities/media-detail";

export const GameHistory = memo(({ history }: { history: HistoryItem[] }) => {
  const { t } = useTranslation();

  return (
    <Accordion sx={{ mt: 4 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t("pages.title-guesser.history.title")}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {history.length > 0 ? (
          <List dense>
            {history.map((item, index) => (
              <ListItem
                key={`${item.id}-${index}`}
                secondaryAction={
                  item.isCorrect ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={item.posterUrl} variant="square" />
                </ListItemAvatar>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" align="center">
            {t("pages.title-guesser.history.empty")}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

GameHistory.displayName = "GameHistory";

export const GameFrame = memo(
  ({
    currentImages,
    isFetching,
    gameState,
    onImageError,
  }: {
    currentImages: Image[];
    isFetching: boolean;
    gameState: GameState;
    onImageError: (url: string) => void;
  }) => {
    const { t } = useTranslation();

    const showLoading = (isFetching || gameState === "LOADING") && gameState !== "REVEALED";

    if (showLoading) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 1,
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={220} />
          ))}
        </Box>
      );
    }

    if (!currentImages.length) {
      return (
        <Alert severity="error" icon={<ImageNotSupportedIcon />}>
          {t("pages.title-guesser.frames_load_failed")}
        </Alert>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 1,
        }}
      >
        {currentImages.map((img) => (
          <Card key={img.url} raised>
            <CardMedia
              component="img"
              src={img.url}
              alt={t("pages.title-guesser.frames_alt")}
              referrerPolicy="no-referrer"
              onError={() => onImageError(img.url)}
              sx={{ height: 220, objectFit: "cover" }}
            />
          </Card>
        ))}
      </Box>
    );
  },
);

GameFrame.displayName = "GameFrame";

interface GuessFormProps {
  userGuess: string;
  onUserGuessChange: (val: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onShowHint: () => void;
  disableHint: boolean;
}

export const GuessForm = memo(
  ({ userGuess, onUserGuessChange, onSubmit, onShowHint, disableHint }: GuessFormProps) => {
    const { t } = useTranslation();

    return (
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label={t("pages.title-guesser.form.label")}
            variant="outlined"
            value={userGuess}
            onChange={(e) => onUserGuessChange(e.target.value)}
            autoFocus
          />
          <Button type="submit" variant="contained" size="large">
            {t("pages.title-guesser.form.guess")}
          </Button>
        </Stack>

        <Button
          startIcon={<LightbulbIcon />}
          onClick={onShowHint}
          sx={{ mt: 1 }}
          disabled={disableHint}
        >
          {t("pages.title-guesser.form.hint")}
        </Button>
      </Box>
    );
  },
);

GuessForm.displayName = "GuessForm";
