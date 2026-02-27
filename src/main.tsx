import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { catppuccinMacchiato } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import App from "./App";
import { HistoryProvider } from "./providers/HistoryContext";
import { UserInfoProvider } from "./providers/UserInfoContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={catppuccinMacchiato}>
      <GlobalStyle />
      <UserInfoProvider>
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </UserInfoProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
