import { useCallback, useEffect, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useModeratorGetUsersQuery } from "../api/endpoints";
import { showSnackbar } from "@/entities/alert";
import { useAppDispatch } from "@/shared/config";
import { Loader } from "@/shared/ui";

const getRoleLabel = (t: (k: string) => string, role: string) => {
  const key = `pages.moderator-panel.usersTable.roles.${role}`;
  const translated = t(key);
  return translated === key ? role : translated;
};

export const UserListTable = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { data: users, error, isLoading, isFetching, refetch } = useModeratorGetUsersQuery();

  useEffect(() => {
    if (!error) return;

    const errorMessage =
      "data" in error && error.data
        ? JSON.stringify(error.data)
        : t("pages.moderator-panel.usersTable.errors.unknown");

    dispatch(showSnackbar({ open: true, severity: "error", message: errorMessage }));
  }, [dispatch, error, t]);

  const refetchUsers = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasUsers = (users?.length ?? 0) > 0;

  const rows = useMemo(() => users ?? [], [users]);

  if (isLoading) return <Loader open={true} />;

  if (!hasUsers) {
    return <Typography sx={{ p: 2 }}>{t("pages.moderator-panel.usersTable.empty")}</Typography>;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
          p: { xs: 1.5, sm: 2 },
          flexWrap: "wrap",
        }}
      >
        <IconButton
          component={RouterLink}
          to="/"
          edge="start"
          aria-label={t("pages.moderator-panel.usersTable.backHomeAria")}
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Button
          variant="outlined"
          onClick={refetchUsers}
          disabled={isFetching}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {isFetching
            ? t("pages.moderator-panel.usersTable.refreshing")
            : t("pages.moderator-panel.usersTable.refresh")}
        </Button>
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label={t("pages.moderator-panel.usersTable.tableAria")}>
            <TableHead>
              <TableRow>
                <TableCell>{t("pages.moderator-panel.usersTable.columns.id")}</TableCell>
                <TableCell>{t("pages.moderator-panel.usersTable.columns.username")}</TableCell>
                <TableCell>{t("pages.moderator-panel.usersTable.columns.email")}</TableCell>
                <TableCell>{t("pages.moderator-panel.usersTable.columns.role")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((user) => (
                <TableRow hover key={user._id}>
                  <TableCell sx={{ fontFamily: "monospace" }}>{user._id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleLabel(t, user.role)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: { xs: "block", sm: "none" }, px: 1.5, pb: 1.5 }}>
        <Stack spacing={1}>
          {rows.map((user) => (
            <Paper
              key={user._id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.paper" }}
            >
              <Stack spacing={0.75}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} sx={{ wordBreak: "break-word" }}>
                    {user.username}
                  </Typography>
                  <Chip size="small" label={getRoleLabel(t, user.role)} />
                </Box>

                <Divider />

                <Typography variant="caption" color="text.secondary">
                  {t("pages.moderator-panel.usersTable.columns.id")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", wordBreak: "break-word" }}
                >
                  {user._id}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t("pages.moderator-panel.usersTable.columns.email")}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {user.email}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};
