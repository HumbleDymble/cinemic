import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "@/features/theme-switcher";
import { recentViewedSlice } from "@/features/search-bar";
import { authSlice } from "@/entities/user";
import { watchlistSlice } from "@/entities/watchlist";
import { snackbarSlice } from "@/entities/alert";
import { baseApi } from "@/shared/api";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  theme: themeSlice.reducer,
  auth: authSlice.reducer,
  recentViewed: recentViewedSlice.reducer,
  watchlist: watchlistSlice.reducer,
  snackbar: snackbarSlice.reducer,
});
