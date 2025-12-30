import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { SocketProvider } from "../store/socket-provider";
import { AppThemeProvider } from "../store/theme-provider";
import { Router } from "../routes/routes";
import { AppSnackbar } from "@/entities/alert";
import { initI18n } from "@/shared/i18n";

const appStore = store();

initI18n()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <Provider store={appStore}>
        <SocketProvider>
          <AppThemeProvider>
            <Router />
            <AppSnackbar />
          </AppThemeProvider>
        </SocketProvider>
      </Provider>,
    );
  })
  .catch((e) => {
    console.error("i18n init failed", e);
  });
