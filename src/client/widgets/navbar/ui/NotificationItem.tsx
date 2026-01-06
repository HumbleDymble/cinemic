"use client";

import { memo, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { type BaseNotification, type NotificationId } from "@/client/entities/notification";

interface Props {
  notification: BaseNotification;
  onClick: (n: BaseNotification) => void;
  onDelete: (id: NotificationId, e: MouseEvent) => void;
  actionLoadingId: NotificationId | null;
}

export const NotificationItem = memo(
  ({ notification, onClick, onDelete, actionLoadingId }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const isLoading = actionLoadingId === notification._id;

    const bgStyle = !notification.isRead ? theme.palette.action.hover : "transparent";
    const hoverStyle = !notification.isRead
      ? theme.palette.action.selected
      : theme.palette.action.hover;

    return (
      <ListItem
        disablePadding
        component={Button}
        onClick={() => onClick(notification)}
        disabled={isLoading}
        sx={{
          textAlign: "left",
          backgroundColor: bgStyle,
          mb: 0.5,
          borderRadius: 1,
          width: "100%",
          alignItems: "flex-start",
          textTransform: "none",
          "&:hover": { backgroundColor: hoverStyle },
          position: "relative",
        }}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label={t("widgets.navbar.notifications.aria.deleteNotification")}
            onClick={(e) => onDelete(notification._id, e)}
            disabled={isLoading}
            size="small"
          >
            {isLoading ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
          </IconButton>
        }
      >
        <ListItemText
          primary={notification.title}
          secondary={notification.message}
          slotProps={{
            primary: {
              fontWeight: !notification.isRead ? "bold" : "normal",
              variant: "body2",
            },
            secondary: {
              variant: "caption",
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      </ListItem>
    );
  },
);

NotificationItem.displayName = "NotificationItem";
