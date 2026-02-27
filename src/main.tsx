import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { catppuccinMacchiato } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={catppuccinMacchiato}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
