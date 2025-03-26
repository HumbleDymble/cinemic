import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loader } from "@/shared/ui";

const router = createBrowserRouter([
  {
    path: "/",
    hydrateFallbackElement: <Loader />,
    lazy: async () => {
      const module = await import("@/pages/Home");
      return { Component: module.Home };
    },
  },
  {
    path: "/title/:id",
    lazy: async () => {
      const titleModule = await import("@/pages/Title");
      const sharedModule = await import("@/shared/ui");
      return {
        Component: titleModule.TitlePage,
        errorElement: <sharedModule.PageNotFound />,
      };
    },
  },
  {
    path: "/user/signin",
    lazy: async () => {
      const authModule = await import("@/pages/Auth");
      return { Component: authModule.SignIn };
    },
  },
  {
    path: "/user/signup",
    lazy: async () => {
      const authModule = await import("@/pages/Auth");
      return { Component: authModule.SignUp };
    },
  },
  {
    path: "/user/profile",
    lazy: async () => {
      const authModule = await import("@/pages/Profile");
      return { Component: authModule.Profile };
    },
  },
  {
    path: "/user/watchlist",
    lazy: async () => {
      const authModule = await import("@/pages/Watchlist");
      return { Component: authModule.Watchlist };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const sharedModule = await import("@/shared/ui");
      return { Component: sharedModule.PageNotFound };
    },
  },
]);

export const TPLink = () => {
  return <RouterProvider router={router} />;
};
