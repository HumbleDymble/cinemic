import React, { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FriendItem, IncomingRequestItem, SentRequestItem } from "./FriendRequestItem";
import {
  type MyProfileResponse,
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useRemoveFriendMutation,
} from "../api/endpoints";
import type { UserId } from "@/entities/user";

interface Props {
  profileData: MyProfileResponse | undefined;
}

export const FriendsPanel = memo(({ profileData }: Props) => {
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [declineRequest] = useDeclineFriendRequestMutation();
  const [cancelRequest] = useCancelFriendRequestMutation();
  const [removeFriend] = useRemoveFriendMutation();

  const [actionLoadingId, setActionLoadingId] = useState<UserId | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const { friends = [], receivedFriendRequests = [], sentFriendRequests = [] } = profileData ?? {};

  const handleAccept = useCallback(
    async (id: UserId) => {
      setActionLoadingId(id);
      try {
        await acceptRequest(id).unwrap();
      } catch (e) {
        console.error(e);
      } finally {
        setActionLoadingId(null);
      }
    },
    [acceptRequest],
  );

  const handleDecline = useCallback(
    async (id: UserId) => {
      setActionLoadingId(id);
      try {
        await declineRequest(id).unwrap();
      } catch (e) {
        console.error(e);
      } finally {
        setActionLoadingId(null);
      }
    },
    [declineRequest],
  );

  const handleRemove = useCallback(
    async (id: UserId) => {
      setActionLoadingId(id);
      try {
        await removeFriend(id).unwrap();
      } catch (e) {
        console.error(e);
      } finally {
        setActionLoadingId(null);
      }
    },
    [removeFriend],
  );

  const handleCancel = useCallback(
    async (id: UserId) => {
      setActionLoadingId(id);
      try {
        await cancelRequest(id).unwrap();
      } catch (e) {
        console.error(e);
      } finally {
        setActionLoadingId(null);
      }
    },
    [cancelRequest],
  );

  return (
    <Box>
      {receivedFriendRequests.length > 0 && (
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="primary">
            {t("pages.user-profile.friends.incomingRequests")}
          </Typography>

          <List disablePadding>
            {receivedFriendRequests.map((user) => (
              <IncomingRequestItem
                key={user._id}
                user={user}
                onAccept={handleAccept}
                onDecline={handleDecline}
                loadingId={actionLoadingId}
              />
            ))}
          </List>
        </Paper>
      )}

      <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
        {t("pages.user-profile.friends.yourFriendsWithCount", { count: friends.length })}
      </Typography>

      {friends.length > 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <List disablePadding>
            {friends.map((friend, index) => (
              <React.Fragment key={friend._id}>
                <FriendItem user={friend} onRemove={handleRemove} loadingId={actionLoadingId} />
                {index < friends.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography color="text.secondary" sx={{ py: { xs: 1.5, md: 2 } }}>
          {t("pages.user-profile.friends.empty")}
        </Typography>
      )}

      {sentFriendRequests.length > 0 && (
        <Box mt={{ xs: 3, md: 4 }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="text.secondary">
            {t("pages.user-profile.friends.sentRequests")}
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <List disablePadding>
              {sentFriendRequests.map((user, index) => (
                <React.Fragment key={user._id}>
                  <SentRequestItem
                    user={user}
                    onCancel={handleCancel}
                    loadingId={actionLoadingId}
                  />
                  {index < sentFriendRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
});

FriendsPanel.displayName = "FriendsPanel";
