import { createSlice } from "@reduxjs/toolkit";

export interface ITitle {
  id: string;
  title: string;
  image: string;
  images?: string[];
  rating: {
    star: number;
    count: number;
  };
  // New fields from the provided data
  review_api_path?: string;
  contentType?: string;
  plot?: string;
  contentRating?: string;
  genre?: string[];
  year?: number;
  runtime?: number | null;
  filmingLocations?: string[];
  actors?: string[];
  directors?: string[];
}
interface TitlePageType {
  titleData: ITitle[];
}

const initialTitlePage: TitlePageType = {
  titleData: [],
};

export interface TitlePageAction {
  type: string;
  payload: ITitle;
}

export const titlePageSlice = createSlice({
  name: "titlePage",
  initialState: initialTitlePage,
  reducers: {
    fetchDataTitle(state, action: TitlePageAction) {
      state.titleData = [action.payload];
    },
  },
});

export const { fetchDataTitle } = titlePageSlice.actions;
