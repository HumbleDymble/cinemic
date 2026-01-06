import type { UserId } from "@/client/entities/user";
import type { KpMovieId } from "@/client/entities/media-detail";

export interface Watchlist {
  userId: UserId;
  watchlist: KpMovieId[];
}
