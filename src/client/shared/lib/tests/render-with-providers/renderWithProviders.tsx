import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { combineReducers, configureStore, type ReducersMapObject } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { baseApi } from "@/client/shared/api";
import i18n from "@/client/shared/i18n";
import { mockRouter, setMockParams, setMockRoute, setMockSearchParams, } from "./nextNavigationModuleMock";

type Params = Record<string, string | string[]>;

interface ExtendedRenderOptions<S> extends Omit<RenderOptions, "queries"> {
  route?: string;
  params?: Params;
  searchParams?: string;
  initialState?: Partial<S>;
  asyncReducers?: ReducersMapObject<S>;
}

export function renderWithProviders<S>(
  component: ReactNode,
  options: ExtendedRenderOptions<S> = {},
) {
  const {
    route = "/",
    params,
    searchParams,
    initialState,
    asyncReducers,
    ...renderOptions
  } = options;

  setMockRoute(route);
  if (params) setMockParams(params);
  if (searchParams != null) setMockSearchParams(searchParams);

  const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    ...(asyncReducers ?? {}),
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>{children}</Provider>
      </I18nextProvider>
    );
  }

  return {
    store,
    router: mockRouter,
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
  };
}
