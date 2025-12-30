import { useGetWatchlistQuery } from "@/entities/watchlist";
import { useAppSelector } from "@/shared/config";

export const useGetWatchlist = () => {
  const token = useAppSelector((state) => state.auth.accessToken);

  const {
    data,
    isLoading: loadingIds,
    isSuccess,
  } = useGetWatchlistQuery(undefined, {
    skip: !token,
  });

  const watchlistIds = data?.watchlist ?? [];

  return {
    loadingIds,
    isSuccess,
    token,
    watchlistIds,
  };
};
