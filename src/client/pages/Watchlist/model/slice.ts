import { createSlice } from "@reduxjs/toolkit";

export interface IWatchlist {
  position: number;
  id: string;
  title: string;
  url: string;
  year: string;
  genres: string;
  votes: string;
  rating: string;
}

export interface WatchlistState {
  parsedData: IWatchlist[];
}

const defaultWatchlistState: WatchlistState = {
  parsedData: [],
};

export interface SearchWatchlistAction {
  type: string;
  payload: IWatchlist[];
}

export const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: defaultWatchlistState,
  reducers: {
    addWatchlistData(state, action: SearchWatchlistAction) {
      state.parsedData = action.payload;
    },
  },
});

export const { addWatchlistData } = watchlistSlice.actions;
