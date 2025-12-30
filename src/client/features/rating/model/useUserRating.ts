import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddRatingMutation, useGetRatingQuery, useRemoveRatingMutation } from "../api/endpoints";
import type { MovieDtoV1_4 } from "@/entities/media-detail";
import { useAppSelector } from "@/shared/config";

interface Props {
  data: MovieDtoV1_4;
}

export const useUserRating = ({ data }: Props) => {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const token = useAppSelector((state) => state.auth.accessToken);

  const [addRating, { isLoading: isAdding }] = useAddRatingMutation();
  const [removeRating, { isLoading: isRemoving }] = useRemoveRatingMutation();

  const { data: ratingData, isLoading: isQueryLoading } = useGetRatingQuery(
    { titleId: data?.id },
    { skip: !data?.id || !token },
  );

  const rating = ratingData?.rating ?? null;
  const hasRated = rating !== null;

  const isUpdating = isAdding ?? isRemoving;

  const isLoggedIn = !!token;
  const isButtonDisabled = !isLoggedIn;

  const handleOpenDialog = useCallback(() => {
    if (!isButtonDisabled) setIsDialogOpen(true);
  }, [isButtonDisabled]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleSubmitRating = useCallback(
    async (newRating: number) => {
      if (!data?.id) return;

      try {
        await addRating({ titleId: data.id, rating: newRating }).unwrap();
        handleCloseDialog();
      } catch (e) {
        console.error("Failed to submit rating:", e);
      }
    },
    [data?.id, addRating, handleCloseDialog],
  );

  const handleRemoveRating = useCallback(async () => {
    if (!data?.id) return;

    try {
      await removeRating({ titleId: data.id }).unwrap();
      handleCloseDialog();
    } catch (e) {
      console.error("Failed to remove rating:", e);
    }
  }, [data?.id, removeRating, handleCloseDialog]);

  const getTooltipTitle = () => {
    if (!isLoggedIn) return t("features.user-rating.tooltip_login");
    if (hasRated) return t("features.user-rating.tooltip_rated", { rating });
    return t("features.user-rating.tooltip_rate");
  };

  const title = data?.name ?? data?.enName ?? t("features.user-rating.unknown_title");

  return {
    title,
    getTooltipTitle,
    handleRemoveRating,
    handleSubmitRating,
    handleOpenDialog,
    handleCloseDialog,
    hasRated,
    isDialogOpen,
    isButtonDisabled,
    isUpdating,
    isQueryLoading,
    rating,
  };
};
