"use client";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import Popover from "@mui/material/Popover";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "../model/useNotifications";

interface Props {
  token: string | null;
}

export const NotificationPopoverDisplay = memo(({ token }: Props) => {
  const { t } = useTranslation();

  const {
    anchor,
    unreadCount,
    isOpen,
    noNotifications,
    handleOpen,
    handleClose,
    handleDeleteAll,
    handleItemClick,
    handleDelete,
    isLoading,
    isDeletingMany,
    activeActionId,
    isFetching,
    page,
    allNotifications,
    listRef,
    sentinelRef,
  } = useNotifications({ token });

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        disabled={!token}
        aria-label={t("widgets.navbar.notifications.aria.showNew", { count: unreadCount })}
      >
        <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "92vw", sm: 380 },
              maxWidth: 420,
              maxHeight: 450,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{t("widgets.navbar.notifications.title")}</Typography>

          <Tooltip title={t("widgets.navbar.notifications.actions.deleteAllShown")}>
            <span>
              <IconButton
                size="small"
                onClick={handleDeleteAll}
                disabled={Boolean(noNotifications) || Boolean(isDeletingMany) || Boolean(isLoading)}
                aria-label={t("widgets.navbar.notifications.aria.deleteAllShown")}
              >
                <DeleteSweepIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {isLoading && page === 1 ? (
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <CircularProgress />
          </Box>
        ) : noNotifications ? (
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              {t("widgets.navbar.notifications.empty")}
            </Typography>
          </Box>
        ) : (
          <List dense ref={listRef} sx={{ overflowY: "auto", flexGrow: 1, p: 1 }}>
            {allNotifications.map((notif) => (
              <NotificationItem
                key={notif._id}
                notification={notif}
                onClick={handleItemClick}
                onDelete={handleDelete}
                actionLoadingId={activeActionId}
              />
            ))}

            <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

            {isFetching && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </List>
        )}
      </Popover>
    </>
  );
});

NotificationPopoverDisplay.displayName = "NotificationPopoverDisplay";
