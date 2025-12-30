import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { GameFrame, GameHistory, GuessForm } from "./GuessForm";
import { useTitleGuesser } from "../model/useTitleGuesser";

export const TitleGuesser = () => {
  const { t } = useTranslation();
  const { state, actions } = useTitleGuesser();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          {t("pages.title-guesser.page_title")}
        </Typography>

        <Chip
          icon={<LocalFireDepartmentIcon />}
          label={t("pages.title-guesser.streak", { count: state.streak })}
          color="warning"
        />
      </Stack>

      <GameFrame
        currentImages={state.currentImages}
        isFetching={state.isFetching}
        gameState={state.gameState}
        onImageError={actions.handleImageError}
      />

      <Collapse in={state.showHint && state.gameState === "PLAYING"}>
        <Alert severity="info" icon={<LightbulbIcon />} sx={{ mt: 2 }}>
          <strong>{t("pages.title-guesser.hint.title")}</strong>{" "}
          {t("pages.title-guesser.hint.top_cast", { cast: state.topCast })}
        </Alert>
      </Collapse>

      {state.apiBlocked && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t("pages.title-guesser.api_blocked")}
        </Alert>
      )}

      {state.gameState === "REVEALED" && state.movieData && (
        <Alert severity={state.isGuessCorrect ? "success" : "error"} sx={{ mt: 2 }}>
          <Typography variant="h6">
            {state.isGuessCorrect
              ? t("pages.title-guesser.revealed.correct")
              : t("pages.title-guesser.revealed.incorrect")}
          </Typography>
          <Typography>{state.displayTitle}</Typography>
        </Alert>
      )}

      {state.gameState === "PLAYING" && (
        <GuessForm
          userGuess={state.userGuess}
          onUserGuessChange={actions.setUserGuess}
          onSubmit={actions.handleGuessSubmit}
          onShowHint={actions.handleShowHint}
          disableHint={state.showHint}
        />
      )}

      {state.gameState === "REVEALED" && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={actions.startNewGame}
          endIcon={<NavigateNextIcon />}
          sx={{ mt: 2 }}
        >
          {t("pages.title-guesser.next_movie")}
        </Button>
      )}

      <GameHistory history={state.history} />
    </Container>
  );
};
