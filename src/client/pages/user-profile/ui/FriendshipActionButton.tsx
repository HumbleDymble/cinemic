import { memo, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from "../api/endpoints";
import type { UserId } from "@/entities/user";

type MutationTrigger = (userId: UserId) => void | Promise<unknown>;

interface FriendshipActionButtonProps {
  status: "friends" | "request_sent" | "request_received" | "none";
  userId: UserId;
}

export const FriendshipActionButton = memo(({ status, userId }: FriendshipActionButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sendRequest, { isLoading: isSending }] = useSendFriendRequestMutation();
  const [removeFriend, { isLoading: isRemoving }] = useRemoveFriendMutation();
  const [declineRequest, { isLoading: isDeclining }] = useDeclineFriendRequestMutation();
  const [cancelRequest, { isLoading: isCanceling }] = useCancelFriendRequestMutation();
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();

  const handleAction = (e: MouseEvent<HTMLButtonElement>, action: MutationTrigger) => {
    e.preventDefault();
    e.stopPropagation();
    void action(userId);
  };

  const buttonSx = {
    borderRadius: 20,
    boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
    textTransform: "none",
    fontWeight: 600,
    ...(isMobile ? { width: "100%" } : null),
  } as const;

  switch (status) {
    case "friends":
      return (
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="error"
          startIcon={<PersonRemoveIcon />}
          disabled={isRemoving}
          onClick={(e) => handleAction(e, removeFriend)}
          sx={buttonSx}
        >
          {isRemoving
            ? t("pages.user-profile.friends.actionButton.removing")
            : t("pages.user-profile.friends.actionButton.removeFriend")}
        </Button>
      );

    case "request_sent":
      return (
        <Button
          fullWidth={isMobile}
          variant="outlined"
          sx={{
            ...buttonSx,
            bgcolor: "rgba(255,255,255,0.1)",
            color: "white",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)", borderColor: "white" },
          }}
          startIcon={<CancelScheduleSendIcon />}
          disabled={isCanceling}
          onClick={(e) => handleAction(e, cancelRequest)}
        >
          {isCanceling
            ? t("pages.user-profile.friends.actionButton.canceling")
            : t("pages.user-profile.friends.actionButton.cancelRequest")}
        </Button>
      );

    case "request_received":
      return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%" }}>
          <Button
            fullWidth={isMobile}
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            disabled={isAccepting ?? isDeclining}
            onClick={(e) => handleAction(e, acceptRequest)}
            sx={buttonSx}
          >
            {isAccepting
              ? t("pages.user-profile.friends.actionButton.accepting")
              : t("pages.user-profile.friends.actionButton.accept")}
          </Button>

          <Button
            fullWidth={isMobile}
            variant="contained"
            color="inherit"
            startIcon={<CloseIcon />}
            disabled={isAccepting ?? isDeclining}
            onClick={(e) => handleAction(e, declineRequest)}
            sx={{
              ...buttonSx,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            {isDeclining
              ? t("pages.user-profile.friends.actionButton.declining")
              : t("pages.user-profile.friends.actionButton.decline")}
          </Button>
        </Stack>
      );

    case "none":
    default:
      return (
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="primary"
          startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
          disabled={isSending}
          onClick={(e) => handleAction(e, sendRequest)}
          sx={{
            ...buttonSx,
            bgcolor: "white",
            color: "primary.main",
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          {isSending
            ? t("pages.user-profile.friends.actionButton.sending")
            : t("pages.user-profile.friends.actionButton.addFriend")}
        </Button>
      );
  }
});

FriendshipActionButton.displayName = "FriendshipActionButton";
