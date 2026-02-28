import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import App from "./App";
import { ThemeContextProvider, useThemeContext } from "./providers/ThemeContext";
import { CommandHistoryProvider } from "./providers/CommandHistoryContext";
import { HistoryProvider } from "./providers/HistoryContext";
import { UserInfoProvider } from "./providers/UserInfoContext";

const ThemedApp = () => {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UserInfoProvider>
        <HistoryProvider>
          <CommandHistoryProvider>
            <App />
          </CommandHistoryProvider>
        </HistoryProvider>
      </UserInfoProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  </React.StrictMode>,
);
