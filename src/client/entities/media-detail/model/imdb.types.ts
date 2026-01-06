export interface ImdbData {
  id: string;
  review_api_path: string;
  imdb: string;
  contentType: "TVSeries" | "Movie" | string;
  productionStatus: string;
  title: string;
  image: string;
  images: string[];
  plot: string;
  rating: ImdbRating;
  award: ImdbAward;
  contentRating: string;
  genre: string[];
  year: number;
  runtime: number | null;
  releaseDeatiled: ImdbReleaseDetailed;
  spokenLanguages: ImdbSpokenLanguage[];
  filmingLocations: string | string[] | null;
  actors: string[] | null;
  directors: string[] | null;
  top_credits: string[] | null;
  seasons: string[] | null;
}

export interface ImdbRating {
  count: number;
  star: number;
}

export interface ImdbAward {
  wins: number;
  nominations: number;
}

export interface ImdbReleaseDetailed {
  day: number;
  month: number;
  year: number;
  releaseLocation: ImdbReleaseLocation;
  originLocations: string[] | null;
}

export interface ImdbReleaseLocation {
  country: string;
  cca2: string;
}

export interface ImdbSpokenLanguage {
  language: string;
  id: string;
}
