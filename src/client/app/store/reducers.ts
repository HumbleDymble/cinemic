import { combineReducers } from "@reduxjs/toolkit";
import { api } from "@/shared/api/api";
import { AuthSlice } from "@/pages/Auth/model/authSlice";
import { getCookiesSlice } from "@/pages/Auth/model/getCookiesSlice";
import { searchSlice } from "@/features/search-bar/model/slice";
import { titlePageSlice } from "@/pages/Title/model/slice";
import { recentViewedSlice } from "@/features/RecentViewed/model/slice";
import { changePasswordSlice } from "@/pages/Profile/model/slice";
import { watch } from "fs";
import { watchlistSlice } from "@/pages/Watchlist/model/slice";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: AuthSlice.reducer,
  getCookies: getCookiesSlice.reducer,
  search: searchSlice.reducer,
  title: titlePageSlice.reducer,
  recentViewed: recentViewedSlice.reducer,
  changePassword: changePasswordSlice.reducer,
  watchlist: watchlistSlice.reducer
});
