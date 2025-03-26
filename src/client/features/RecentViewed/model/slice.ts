import { createSlice } from "@reduxjs/toolkit";
import { type ISearch } from "../../search-bar/model/slice";

export interface RecentViewedState {
  recentViewed: ISearch[];
}

export const DefaultRecentViewedState: RecentViewedState = {
  recentViewed: [],
};

export interface RecentViewedAction {
  type: string;
  payload: ISearch;
}

export const recentViewedSlice = createSlice({
  name: "recentViewed",
  initialState: DefaultRecentViewedState,
  reducers: {
    getDataFromLocalStorage(state) {
      const storedData: ISearch[] = JSON.parse(
        localStorage.getItem("recentViewed") ?? "",
      );
      if (state.recentViewed !== storedData && localStorage.length > 0) {
        state.recentViewed = storedData;
      }
    },
    operateLocalStorage(state, action: RecentViewedAction) {
      const addItemToLocalStorage = (array: ISearch[] = [], item: ISearch) => {
        const lastElemNum = array.lastIndexOf(item);
        const elemNum = array.findIndex((i: ISearch) => i.id === item.id);

        if (lastElemNum !== elemNum) {
          array.splice(elemNum, 1);
        }
        array.push({ id: item.id, title: item.title, image: item.image });
        localStorage.setItem("recentViewed", JSON.stringify(array));
      };
      addItemToLocalStorage(state.recentViewed, action.payload);
    },
    clearRecentViewedData(state) {
      state.recentViewed = [];
    },
  },
});

export const { getDataFromLocalStorage, clearRecentViewedData } =
  recentViewedSlice.actions;
