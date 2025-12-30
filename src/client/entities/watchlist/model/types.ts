import type { UserId } from "@/entities/user";
import type { KpMovieId } from "@/entities/media-detail";

export interface Watchlist {
  userId: UserId;
  watchlist: KpMovieId[];
}
