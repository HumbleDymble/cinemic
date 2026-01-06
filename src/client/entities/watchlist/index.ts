export {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "./api/endpoints";
export type { Watchlist } from "./model/types";
export {
  getUserWatchlist,
  fetchWatchlistData,
  removeWatchlistDataItem,
  addWatchlistDataItem,
  watchlistSlice,
} from "./model/slice";
