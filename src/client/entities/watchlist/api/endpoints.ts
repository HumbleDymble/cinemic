import type { Watchlist } from "../model/types";
import type { KpMovieId } from "@/entities/media-detail";
import { baseApi } from "@/shared/api";

interface AddToWatchlistParams {
  id: KpMovieId;
}

interface AddToWatchlistResponse {
  watchlist: KpMovieId[];
}

export const watchlistEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWatchlist: build.query<Watchlist, void>({
      query: () => "/user/watchlist",
      providesTags: [{ type: "Watchlist", id: "LIST" }],
    }),

    addToWatchlist: build.mutation<AddToWatchlistResponse, AddToWatchlistParams>({
      query: ({ id }) => ({
        method: "PUT",
        url: `/user/watchlist/${id}`,
      }),
      invalidatesTags: [{ type: "UserProfile", id: "ME" }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          watchlistEndpoints.util.updateQueryData("getWatchlist", undefined, (draft) => {
            if (!draft.watchlist.includes(id)) {
              draft.watchlist.push(id);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    removeFromWatchlist: build.mutation<AddToWatchlistResponse, AddToWatchlistParams>({
      query: ({ id }) => ({
        method: "DELETE",
        url: `/user/watchlist/${id}`,
      }),
      invalidatesTags: [{ type: "UserProfile", id: "ME" }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          watchlistEndpoints.util.updateQueryData("getWatchlist", undefined, (draft) => {
            draft.watchlist = draft.watchlist.filter((movieId) => movieId !== id);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetWatchlistQuery, useAddToWatchlistMutation, useRemoveFromWatchlistMutation } =
  watchlistEndpoints;
