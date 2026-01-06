"use client";

import { useState } from "react";
import { type SelectChangeEvent } from "@mui/material/Select";
import {
  useAdminGetUsersQuery,
  useAdminSendNotificationMutation,
  useUpdateUserBanMutation,
  useUpdateUserRoleMutation,
} from "../api/endpoints";
import type { User } from "@/client/entities/user";

type DialogType = "role" | "ban" | "notify" | null;

export const useAdminUserTable = () => {
  const { data: users, isLoading, isFetching, refetch } = useAdminGetUsersQuery();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateBan, { isLoading: isUpdatingBan }] = useUpdateUserBanMutation();
  const [sendNotify, { isLoading: isSendingNotify }] = useAdminSendNotificationMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  const [roleForm, setRoleForm] = useState<"user" | "moderator" | "admin">("user");

  const [banForm, setBanForm] = useState<string | null>(null);

  const [notifyForm, setNotifyForm] = useState({
    title: "",
    message: "",
    type: "system",
  });

  const handleOpenDialog = (user: User, type: DialogType) => {
    setSelectedUser(user);
    setActiveDialog(type);

    if (type === "role") {
      setRoleForm(user.role);
    } else if (type === "ban") {
      setBanForm(user.banUntil ?? null);
    } else if (type === "notify") {
      setNotifyForm({ title: "", message: "", type: "system" });
    }
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    setSelectedUser(null);
  };

  const handleRoleChange = (e: SelectChangeEvent<"user" | "moderator" | "admin">) => {
    setRoleForm(e.target.value);
  };

  const setBanDuration = (days: number | "permanent") => {
    if (days === "permanent") {
      setBanForm(new Date("9999-12-31").toISOString());
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + days);
    setBanForm(date.toISOString());
  };

  const liftBan = () => setBanForm(null);

  const handleNotifyChange = (field: keyof typeof notifyForm, value: string) => {
    setNotifyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitRole = async () => {
    if (!selectedUser) return;
    try {
      await updateRole({ userId: selectedUser._id, role: roleForm }).unwrap();
      handleCloseDialog();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitBan = async () => {
    if (!selectedUser) return;
    try {
      await updateBan({ userId: selectedUser._id, banUntil: banForm }).unwrap();
      handleCloseDialog();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitNotify = async () => {
    if (!selectedUser) return;
    try {
      await sendNotify({ userId: selectedUser._id, ...notifyForm }).unwrap();
      handleCloseDialog();
    } catch (e) {
      console.error(e);
    }
  };

  const isMutationLoading = isUpdatingRole ?? isUpdatingBan ?? isSendingNotify;

  return {
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
  };
};
