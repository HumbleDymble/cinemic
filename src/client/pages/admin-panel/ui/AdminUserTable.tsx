"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useAdminUserTable } from "../model/useAdminUserTable";
import { Loader } from "@/client/shared/ui";

export const AdminUserTable = () => {
  const { t, i18n } = useTranslation();

  const {
    users,
    selectedUser,
    activeDialog,
    roleForm,
    banForm,
    notifyForm,
    isLoading,
    isFetching,
    isMutationLoading,
    refetch,
    handleOpenDialog,
    handleCloseDialog,
    handleRoleChange,
    setBanDuration,
    liftBan,
    handleNotifyChange,
    handleSubmitRole,
    handleSubmitBan,
    handleSubmitNotify,
  } = useAdminUserTable();

  if (isLoading) return <Loader open={true} />;

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <IconButton
            component={NextLink}
            href="/"
            aria-label={t("pages.admin-panel.common.aria_go_home")}
            sx={{ color: "text.secondary" }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>
            {isFetching
              ? t("pages.admin-panel.common.refreshing")
              : t("pages.admin-panel.users.refresh_users")}
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label={t("pages.admin-panel.users.table_aria")}>
            <TableHead>
              <TableRow>
                <TableCell>{t("pages.admin-panel.users.columns.username")}</TableCell>
                <TableCell>{t("pages.admin-panel.users.columns.email")}</TableCell>
                <TableCell>{t("pages.admin-panel.users.columns.role")}</TableCell>
                <TableCell>{t("pages.admin-panel.users.columns.status")}</TableCell>
                <TableCell align="center">{t("pages.admin-panel.users.columns.actions")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users?.map((user) => {
                const isBanned = user.banUntil && new Date(user.banUntil) > new Date();
                const bannedUntilText = user.banUntil
                  ? new Date(user.banUntil).toLocaleDateString(i18n.resolvedLanguage)
                  : "";

                return (
                  <TableRow
                    hover
                    key={user._id}
                    sx={{
                      backgroundColor: user.role === "moderator" ? "action.hover" : "transparent",
                      opacity: isBanned ? 0.6 : 1,
                    }}
                  >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Chip
                        label={t(`pages.admin-panel.roles.${user.role}`, {
                          defaultValue: user.role,
                        })}
                        color={
                          user.role === "admin"
                            ? "secondary"
                            : user.role === "moderator"
                              ? "primary"
                              : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {isBanned && user?.banUntil
                        ? t("pages.admin-panel.users.status_banned_until", {
                            date: bannedUntilText,
                          })
                        : t("pages.admin-panel.users.status_active")}
                    </TableCell>

                    <TableCell align="center">
                      <ButtonGroup variant="outlined" size="small" disabled={isMutationLoading}>
                        <Button onClick={() => handleOpenDialog(user, "role")}>
                          {t("pages.admin-panel.users.actions.role")}
                        </Button>
                        <Button onClick={() => handleOpenDialog(user, "ban")} color="warning">
                          {t("pages.admin-panel.users.actions.ban")}
                        </Button>
                        <Button onClick={() => handleOpenDialog(user, "notify")} color="secondary">
                          {t("pages.admin-panel.users.actions.notify")}
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedUser && activeDialog === "role" && (
        <Dialog open={true} onClose={handleCloseDialog} fullWidth maxWidth="xs">
          <DialogTitle>
            {t("pages.admin-panel.users.dialog_role.title", { username: selectedUser.username })}
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>{t("pages.admin-panel.users.dialog_role.role_label")}</InputLabel>
                <Select
                  value={roleForm}
                  label={t("pages.admin-panel.users.dialog_role.role_label")}
                  onChange={handleRoleChange}
                >
                  <MenuItem value="user">{t("pages.admin-panel.roles.user")}</MenuItem>
                  <MenuItem value="moderator">{t("pages.admin-panel.roles.moderator")}</MenuItem>
                  <MenuItem value="admin" disabled>
                    {t("pages.admin-panel.roles.admin")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isMutationLoading}>
              {t("pages.admin-panel.common.cancel")}
            </Button>
            <Button onClick={handleSubmitRole} variant="contained" disabled={isMutationLoading}>
              {isMutationLoading ? (
                <CircularProgress size={24} />
              ) : (
                t("pages.admin-panel.users.dialog_role.save")
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedUser && activeDialog === "ban" && (
        <Dialog open={true} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {t("pages.admin-panel.users.dialog_ban.title", { username: selectedUser.username })}
          </DialogTitle>

          <DialogContent dividers>
            <Typography gutterBottom>{t("pages.admin-panel.users.dialog_ban.duration")}</Typography>

            <ButtonGroup variant="outlined" fullWidth>
              <Button onClick={() => setBanDuration(1)}>
                {t("pages.admin-panel.users.dialog_ban.day_1")}
              </Button>
              <Button onClick={() => setBanDuration(7)}>
                {t("pages.admin-panel.users.dialog_ban.day_7")}
              </Button>
              <Button onClick={() => setBanDuration(30)}>
                {t("pages.admin-panel.users.dialog_ban.day_30")}
              </Button>
              <Button onClick={() => setBanDuration("permanent")} color="secondary">
                {t("pages.admin-panel.users.dialog_ban.permanent")}
              </Button>
            </ButtonGroup>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button onClick={liftBan} color="success" variant="contained">
                {t("pages.admin-panel.users.dialog_ban.lift")}
              </Button>
            </Box>

            <Box
              sx={{ mt: 2, p: 1, textAlign: "center", bgcolor: "action.hover", borderRadius: 1 }}
            >
              <Typography variant="body2">
                {t("pages.admin-panel.users.dialog_ban.proposed_status")}
              </Typography>
              <Typography variant="h6">
                {banForm
                  ? t("pages.admin-panel.users.status_banned_until", {
                      date: new Date(banForm).toLocaleDateString(i18n.resolvedLanguage),
                    })
                  : t("pages.admin-panel.users.status_active")}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isMutationLoading}>
              {t("pages.admin-panel.common.cancel")}
            </Button>
            <Button onClick={handleSubmitBan} variant="contained" disabled={isMutationLoading}>
              {isMutationLoading ? (
                <CircularProgress size={24} />
              ) : (
                t("pages.admin-panel.common.confirm")
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedUser && activeDialog === "notify" && (
        <Dialog open={true} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {t("pages.admin-panel.users.dialog_notify.title", { username: selectedUser.username })}
          </DialogTitle>

          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label={t("pages.admin-panel.users.dialog_notify.field_title")}
              value={notifyForm.title}
              onChange={(e) => handleNotifyChange("title", e.target.value)}
              disabled={isMutationLoading}
            />
            <TextField
              label={t("pages.admin-panel.users.dialog_notify.field_message")}
              value={notifyForm.message}
              onChange={(e) => handleNotifyChange("message", e.target.value)}
              multiline
              rows={4}
              disabled={isMutationLoading}
            />
            <FormControl fullWidth disabled={isMutationLoading}>
              <InputLabel>{t("pages.admin-panel.users.dialog_notify.field_type")}</InputLabel>
              <Select
                value={notifyForm.type}
                label={t("pages.admin-panel.users.dialog_notify.field_type")}
                onChange={(e) => handleNotifyChange("type", e.target.value)}
              >
                {["system", "friend_request", "review"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`pages.admin-panel.notify_types.${type}`, { defaultValue: type })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isMutationLoading}>
              {t("pages.admin-panel.common.cancel")}
            </Button>
            <Button
              onClick={handleSubmitNotify}
              variant="contained"
              disabled={isMutationLoading ?? !notifyForm.title}
            >
              {isMutationLoading ? (
                <CircularProgress size={24} />
              ) : (
                t("pages.admin-panel.users.dialog_notify.send")
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
