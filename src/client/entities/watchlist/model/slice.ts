import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { KpMovieId, MovieDtoV1_4 } from "@/entities/media-detail";

export interface InitialStateType {
  watchlist: KpMovieId[];
  watchlistData: MovieDtoV1_4[];
}

const initialState: InitialStateType = {
  watchlist: [],
  watchlistData: [],
};

export const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    getUserWatchlist(state, action: PayloadAction<KpMovieId[]>) {
      state.watchlist = action.payload;
    },

    fetchWatchlistData(state, action: PayloadAction<MovieDtoV1_4>) {
      const idIndex = state.watchlistData.findIndex((i) => i.id === action.payload.id);

      if (idIndex === -1) {
        state.watchlistData.push(action.payload);
      } else {
        state.watchlistData[idIndex] = action.payload;
      }
    },

    addWatchlistDataItem(state, action: PayloadAction<MovieDtoV1_4>) {
      const exists = state.watchlistData.some((i) => i.id === action.payload.id);
      if (!exists) {
        state.watchlistData.push(action.payload);
      }
    },

    removeWatchlistDataItem(state, action: PayloadAction<KpMovieId>) {
      state.watchlistData = state.watchlistData.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  getUserWatchlist,
  fetchWatchlistData,
  addWatchlistDataItem,
  removeWatchlistDataItem,
} = watchlistSlice.actions;
