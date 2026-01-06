import type { Brand } from "@/client/shared/lib/types";

export type KpMovieId = Brand<number, "KpMovieId">;
export type KpPersonId = Brand<number, "KpPersonId">;
export type KpUserId = Brand<number, "KpUserId">;
export type KpReviewId = Brand<number, "KpReviewId">;

export interface ExternalId {
  kpHD: string | null;
  imdb: string | null;
  tmdb: number | null;
}

export interface Name {
  name: string;
  language: string | null;
  type: string | null;
}

export interface FactInMovie {
  value: string;
  type: string | null;
  spoiler: boolean | null;
}

export interface Rating {
  kp: number | null;
  imdb: number | null;
  tmdb: number | null;
  filmCritics: number | null;
  russianFilmCritics: number | null;
  await: number | null;
}

export interface Votes {
  kp: string | null;
  imdb: number | null;
  tmdb: number | null;
  filmCritics: number | null;
  russianFilmCritics: number | null;
  await: number | null;
}

export interface Logo {
  url: string | null;
}

export interface ShortImage {
  url: string | null;
  previewUrl: string | null;
}

export interface Video {
  url: string | null;
  name: string | null;
  site: string | null;
  size: number | null;
  type: string | null;
}

export interface VideoTypes {
  trailers: Video[] | null;
}

export interface ItemName {
  name: string;
}

export interface CurrencyValue {
  value: number | null;
  currency: string | null;
}

export interface Fees {
  world: CurrencyValue;
  russia: CurrencyValue;
  usa: CurrencyValue;
}

export interface Premiere {
  country: string | null;
  world: string | null;
  russia: string | null;
  digital: string | null;
  cinema: string | null;
  bluray: string | null;
  dvd: string | null;
}

export interface WatchabilityItem {
  name: string | null;
  logo: Logo;
  url: string;
}

export interface Watchability {
  items: WatchabilityItem[];
}

export interface YearRange {
  start: number | null;
  end: number | null;
}

export interface Audience {
  count: number | null;
  country: string | null;
}

export interface LinkedMovieV1_4 {
  id: KpMovieId;
  name: string | null;
  enName: string | null;
  alternativeName: string | null;
  type: string | null;
  poster: ShortImage | null;
  rating: Rating | null;
  year: number | null;
}

export interface MovieDtoV1_4 {
  id: KpMovieId | null;
  externalId: ExternalId | null;
  name: string | null;
  alternativeName: string | null;
  enName: string | null;
  names: Name[] | null;
  type: "movie" | "tv-series" | "cartoon" | "anime" | "animated-series" | "tv-show" | null;
  typeNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
  year: number | null;
  description: string | null;
  shortDescription: string | null;
  slogan: string | null;
  status: "filming" | "pre-production" | "completed" | "announced" | "post-production" | null;
  facts: FactInMovie[] | null;
  rating: Rating;
  votes: Votes;
  movieLength: number | null;
  ratingMpaa: string | null;
  ageRating: number | null;
  logo: Logo;
  poster: ShortImage;
  backdrop: ShortImage;
  videos: VideoTypes;
  genres: ItemName[];
  countries: ItemName[];
  persons: PersonInMovie[];
  reviewInfo: {
    count: number | null;
    positiveCount: number | null;
    percentage: string | null;
  };
  seasonsInfo: {
    number: number | null;
    episodesCount: number | null;
  }[];
  budget: CurrencyValue;
  fees: Fees;
  premiere: Premiere;
  similarMovies: LinkedMovieV1_4[] | null;
  sequelsAndPrequels: LinkedMovieV1_4[] | null;
  watchability: Watchability;
  releaseYears: YearRange[];
  top10: number | null;
  top250: number | null;
  ticketsOnSale: boolean | null;
  totalSeriesLength: number | null;
  seriesLength: number | null;
  isSeries: boolean | null;
  audience: Audience[] | null;
  lists: string[] | null;
  networks: {
    items: { name: string | null; logo: Logo | null }[] | null;
  } | null;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface SearchMovieDtoV1_4 {
  id: KpMovieId;
  name: string | null;
  alternativeName: string | null;
  enName: string | null;
  type: string | null;
  year: number | null;
  description: string | null;
  shortDescription: string | null;
  movieLength: number | null;
  names: Name[] | null;
  externalId: ExternalId | null;
  logo: Logo | null;
  poster: ShortImage | null;
  backdrop: ShortImage | null;
  rating: Rating | null;
  votes: Votes | null;
  genres: ItemName[] | null;
  countries: ItemName[] | null;
  releaseYears: YearRange[] | null;
  isSeries: boolean | null;
  ticketsOnSale: boolean | null;
  totalSeriesLength: number | null;
  seriesLength: number | null;
  ratingMpaa: string | null;
  ageRating: number | null;
  top10: number | null;
  top250: number | null;
  typeNumber: number | null;
  status: string | null;
}

export interface PersonInMovie {
  id: KpPersonId;
  photo: string | null;
  name: string | null;
  enName: string | null;
  description: string | null;
  profession: string | null;
  enProfession: string | null;
}

export interface MovieInPerson {
  id: KpMovieId;
  name: string | null;
  alternativeName: string | null;
  rating: number | null;
  general: boolean | null;
  description: string | null;
  enProfession: string | null;
}

export interface Spouse {
  id: KpPersonId;
  name: string;
  divorced: boolean;
  divorcedReason: string;
  sex: string;
  children: number;
  relation: string;
}

export interface Person {
  id: KpPersonId;
  name: string | null;
  enName: string | null;
  photo: string | null;
  sex: "Мужской" | "Женский" | null;
  growth: number | null;
  birthday: string | null;
  death: string | null;
  age: number | null;
  birthPlace: { value: string }[];
  deathPlace: { value: string }[];
  spouses: Spouse[];
  countAwards: number;
  profession: { value: string }[];
  facts: { value: string }[];
  movies: MovieInPerson[];
  updatedAt: string;
  createdAt: string;
}

export interface EpisodeV1_4 {
  number: number;
  name: string;
  enName: string;
  date: string;
  description: string;
  still: ShortImage;
  airDate: string;
  enDescription: string;
}

export interface SeasonV1_4 {
  movieId: KpMovieId;
  number: number;
  episodesCount: number;
  episodes: EpisodeV1_4[];
  poster: ShortImage;
  name: string;
  enName: string;
  duration: number;
  description: string;
  enDescription: string;
  airDate: string;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface Review {
  id: KpReviewId;
  movieId: KpMovieId;
  authorId: KpUserId;
  title: string;
  type: "Негативный" | "Нейтральный" | "Позитивный";
  review: string;
  date: string;
  author: string;
  userRating: number;
  reviewLikes: number;
  reviewDislikes: number;
  updatedAt: string;
  createdAt: string;
}

export interface Nomination {
  award: {
    title: string | null;
    year: number | null;
  } | null;
  title: string | null;
}

export interface MovieAward {
  movieId: KpMovieId | null;
  nomination: Nomination | null;
  winning: boolean | null;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface Image {
  movieId: KpMovieId;
  type:
    | "backdrops"
    | "cover"
    | "frame"
    | "promo"
    | "screenshot"
    | "shooting"
    | "still"
    | "wallpaper";
  language: string;
  url: string;
  previewUrl: string;
  height: number;
  width: number;
  updatedAt: string;
  createdAt: string;
}

export interface PossibleValueDto {
  name: string | null;
  slug: string | null;
}

export type ListCategory = "Онлайн-кинотеатр" | "Премии" | "Сборы" | "Сериалы" | "Фильмы" | string;

export interface List {
  category: ListCategory | null;
  slug: string | null;
  moviesCount: number | null;
  cover: ShortImage | null;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface MovieInListDto {
  id: KpMovieId;
  name: string | null;
  enName: string | null;
  alternativeName: string | null;
  year: number | null;
  movieLength: number | null;
  poster: ShortImage | null;
  rating: Rating | null;
}

export interface MovieListItemWithMovieDto {
  position: number;
  positionDiff: number | null;
  rating: number | null;
  votes: number | null;
  movie: MovieInListDto;
}

export interface ListWithMoviesResponseDtoV1_5 {
  category: ListCategory | null;
  name: string;
  slug: string | null;
  moviesCount: number | null;
  cover: ShortImage | null;
  movies: CursorPaginatedResponse<MovieListItemWithMovieDto>;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface PaginatedResponse<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface CursorPaginatedResponse<T> {
  docs: T[];
  total: number;
  limit: number;
  next: string | null;
  hasNext: boolean;
}

export type MovieDocsResponseDtoV1_4 = PaginatedResponse<MovieDtoV1_4>;
export type SearchMovieResponseDtoV1_4 = PaginatedResponse<SearchMovieDtoV1_4>;
export type SeasonDocsResponseDtoV1_4 = PaginatedResponse<SeasonV1_4>;
export type ReviewDocsResponseDtoV1_4 = PaginatedResponse<Review>;
export type PersonDocsResponseDtoV1_4 = PaginatedResponse<Person>;
export type MovieAwardDocsResponseDto = PaginatedResponse<MovieAward>;
export type ImageDocsResponseDtoV1_4 = PaginatedResponse<Image>;
export type ListDocsResponseDtoV1_4 = PaginatedResponse<List>;

export interface ErrorResponseDto {
  statusCode: number;
  message: string;
  error: string;
}

export interface UnauthorizedErrorResponseDto {
  statusCode: 401;
  message: string;
  error: "Unauthorized";
}

export interface ForbiddenErrorResponseDto {
  statusCode: 403;
  message: string;
  error: "Forbidden";
}
