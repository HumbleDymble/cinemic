import type { Brand } from "@/shared/lib/types";

export type UserId = Brand<string, "UserId">;

export interface User {
  _id: UserId;
  username: string;
  email: string;
  password: string;
  role: "admin" | "moderator" | "user";
  rating: string[];
  watchlist: string[];
  banUntil?: string;
  isBanned?: boolean;
  lastUsernameChange?: string | Date;
}

export interface AuthenticatedUser {
  user: User | null;
  accessToken: string | null;
}

export type LoginForm = Pick<User, "email" | "password">;

export type RegisterForm = Pick<User, "email" | "password" | "username">;
