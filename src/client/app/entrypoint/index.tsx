import { ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { TPLink } from "../routes/routes";
import { store } from "../store/store";
import "../styles/null.scss";
import { defaultTheme } from "../theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={defaultTheme}>
      <TPLink />
    </ThemeProvider>
  </Provider>,
);
