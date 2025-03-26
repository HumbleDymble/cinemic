import { createSlice } from "@reduxjs/toolkit";

export interface ISearch {
  id: string;
  title: string;
  image: string;
}

export interface SearchState {
  search: string;
  searchData: ISearch[];
}

const defaultSearchState: SearchState = {
  search: "",
  searchData: [],
};

export interface SearchStateAction {
  type: string;
  payload: ISearch[];
}

export const searchSlice = createSlice({
  name: "search",
  initialState: defaultSearchState,
  reducers: {
    addSearchData(state, action: SearchStateAction) {
      state.searchData = action.payload;
    },
    clearSearchData(state) {
      state.searchData = [];
    },
  },
});

export const { addSearchData, clearSearchData } = searchSlice.actions;
