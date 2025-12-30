import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { baseApi } from "@/shared/api";

export const store = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
};

declare global {
  type RootState = ReturnType<typeof rootReducer>;
  type AppStore = ReturnType<typeof store>;
  type AppDispatch = AppStore["dispatch"];
}
