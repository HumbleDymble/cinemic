import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, configureStore, type ReducersMapObject } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { baseApi } from "@/shared/api";
import i18n from "@/shared/i18n";

interface ExtendedRenderOptions<S> extends Omit<RenderOptions, "queries"> {
  route?: string;
  initialState?: Partial<S>;
  asyncReducers?: ReducersMapObject<S>;
}

export function renderWithProviders<S>(
  component: ReactNode,
  options: ExtendedRenderOptions<S> = {},
) {
  const { route = "/", initialState, asyncReducers, ...renderOptions } = options;

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
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </Provider>
      </I18nextProvider>
    );
  }

  return { store, ...render(component, { wrapper: Wrapper, ...renderOptions }) };
}
