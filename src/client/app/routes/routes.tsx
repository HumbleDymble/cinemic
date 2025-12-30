import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loader } from "@/shared/ui";

const router = createBrowserRouter([
  {
    path: "/",
    hydrateFallbackElement: <Loader open={true} />,
    lazy: async () => {
      const module = await import("@/pages/home");
      return { Component: module.Home };
    },
  },
  {
    lazy: async () => {
      const module = await import("@/pages/auth");
      return { Component: module.IsGuest };
    },
    children: [
      {
        path: "auth/signin",
        lazy: async () => {
          const module = await import("@/pages/auth");
          return { Component: module.SignIn };
        },
      },
      {
        path: "auth/signup",
        lazy: async () => {
          const module = await import("@/pages/auth");
          return { Component: module.SignUp };
        },
      },
    ],
  },
  {
    path: "/banned",
    lazy: async () => {
      const module = await import("@/pages/auth");
      return { Component: module.IsBanned };
    },
  },
  {
    lazy: async () => {
      const module = await import("@/pages/auth");
      return { Component: module.IsAuthenticated };
    },
    children: [
      {
        path: "auth/settings",
        lazy: async () => {
          const module = await import("@/pages/user-settings");
          return { Component: module.UserSettings };
        },
      },
      {
        path: "user/watchlist",
        lazy: async () => {
          const module = await import("@/pages/watchlist");
          return { Component: module.Watchlist };
        },
      },
      {
        path: "title/:id",
        lazy: async () => {
          const module = await import("@/pages/media-details");
          return {
            Component: module.MediaDetails,
          };
        },
      },
      {
        path: "title/:titleId/review-thread",
        lazy: async () => {
          const module = await import("@/pages/review-thread");
          return { Component: module.ReviewThread };
        },
      },
      {
        path: "moderator/users",
        lazy: async () => {
          const module = await import("@/pages/moderator-panel");
          return { Component: module.ModeratorPanel };
        },
      },
      {
        path: "admin/users",
        lazy: async () => {
          const module = await import("@/pages/admin-panel");
          return { Component: module.AdminPanel };
        },
      },
      {
        path: "user/profile",
        lazy: async () => {
          const module = await import("@/pages/user-profile");
          return { Component: module.UserProfile };
        },
      },
      {
        path: "user/profile/:userId",
        lazy: async () => {
          const module = await import("@/pages/user-profile");
          return { Component: module.PublicUserProfile };
        },
      },
      {
        path: "title/guess",
        lazy: async () => {
          const module = await import("@/pages/title-guesser");
          return { Component: module.TitleGuesser };
        },
      },
      {
        path: "user/random-title",
        lazy: async () => {
          const module = await import("@/pages/random-title");
          return { Component: module.RandomTitle };
        },
      },
    ],
  },
  {
    path: "*",
    lazy: async () => {
      const module = await import("@/pages/not-found");
      return { Component: module.PageNotFound };
    },
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
