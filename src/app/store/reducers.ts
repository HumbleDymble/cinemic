import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "@/client/features/theme-switcher";
import { recentViewedSlice } from "@/client/features/search-bar";
import { authSlice } from "@/client/entities/user";
import { watchlistSlice } from "@/client/entities/watchlist";
import { snackbarSlice } from "@/client/entities/alert";
import { baseApi } from "@/client/shared/api";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  theme: themeSlice.reducer,
  auth: authSlice.reducer,
  recentViewed: recentViewedSlice.reducer,
  watchlist: watchlistSlice.reducer,
  snackbar: snackbarSlice.reducer,
});
