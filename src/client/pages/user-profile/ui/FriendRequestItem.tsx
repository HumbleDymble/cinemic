import React, { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import MuiLink from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { User, UserId } from "@/entities/user";

interface IncomingRequestProps {
  user: User;
  onAccept: (id: UserId) => void;
  onDecline: (id: UserId) => void;
  loadingId: UserId | null;
}

export const IncomingRequestItem = memo(
  ({ user, onAccept, onDecline, loadingId }: IncomingRequestProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const isLoading = loadingId === user._id;

    return (
      <ListItem
        divider
        sx={{
          px: 0,
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 1 : 2,
        }}
      >
        <ListItemAvatar sx={{ minWidth: 56, mt: isMobile ? 0.5 : 0 }}>
          <Avatar
            component={RouterLink}
            to={`/user/profile/${user._id}`}
            sx={{ textDecoration: "none" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          sx={{ my: 0, pr: isMobile ? 0 : 1 }}
          primary={
            <MuiLink
              component={RouterLink}
              to={`/user/profile/${user._id}`}
              underline="hover"
              color="text.primary"
              fontWeight="bold"
              sx={{ wordBreak: "break-word" }}
            >
              {user.username}
            </MuiLink>
          }
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            minWidth: isMobile ? 140 : "auto",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <Button
            size="small"
            variant="contained"
            disabled={isLoading}
            onClick={() => onAccept(user._id)}
            fullWidth={isMobile}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("pages.user-profile.friends.actions.accept")
            )}
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={isLoading}
            onClick={() => onDecline(user._id)}
            fullWidth={isMobile}
          >
            {t("pages.user-profile.friends.actions.decline")}
          </Button>
        </Stack>
      </ListItem>
    );
  },
);

IncomingRequestItem.displayName = "IncomingRequestItem";

interface FriendItemProps {
  user: User;
  onRemove: (id: UserId) => void;
  loadingId: UserId | null;
}

export const FriendItem = memo(({ user, onRemove, loadingId }: FriendItemProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isLoading = loadingId === user._id;

  return (
    <ListItem
      sx={{
        borderRadius: 1,
        "&:hover": { backgroundColor: "action.hover" },
        alignItems: isMobile ? "flex-start" : "center",
      }}
      secondaryAction={
        <Button
          size="small"
          color="error"
          disabled={isLoading}
          onClick={() => onRemove(user._id)}
          sx={{ mt: isMobile ? 0.5 : 0 }}
        >
          {isLoading
            ? t("pages.user-profile.friends.actions.removing")
            : t("pages.user-profile.friends.actions.remove")}
        </Button>
      }
    >
      <ListItemAvatar sx={{ minWidth: 56, mt: isMobile ? 0.5 : 0 }}>
        <Avatar
          component={RouterLink}
          to={`/user/profile/${user._id}`}
          sx={{ textDecoration: "none" }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <MuiLink
            component={RouterLink}
            to={`/user/profile/${user._id}`}
            underline="none"
            color="inherit"
            sx={{ "&:hover": { textDecoration: "underline" }, wordBreak: "break-word" }}
          >
            {user.username}
          </MuiLink>
        }
      />
    </ListItem>
  );
});

FriendItem.displayName = "FriendItem";

interface SentRequestProps {
  user: User;
  onCancel: (id: UserId) => void;
  loadingId: UserId | null;
}

export const SentRequestItem = memo(({ user, onCancel, loadingId }: SentRequestProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isLoading = loadingId === user._id;

  return (
    <ListItem
      sx={{
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? 1 : 2,
      }}
      secondaryAction={
        <Button
          size="small"
          color="secondary"
          disabled={isLoading}
          onClick={() => onCancel(user._id)}
          sx={{ mt: isMobile ? 0.5 : 0 }}
        >
          {isLoading
            ? t("pages.user-profile.friends.actions.canceling")
            : t("pages.user-profile.friends.actions.cancel")}
        </Button>
      }
    >
      <ListItemText
        primary={user.username}
        secondary={t("pages.user-profile.friends.sent.waiting")}
        slotProps={{ primary: { sx: { wordBreak: "break-word" } } }}
      />
    </ListItem>
  );
});

SentRequestItem.displayName = "SentRequestItem";
