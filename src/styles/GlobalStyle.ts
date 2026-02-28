import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #root {
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 12px;
    }
  }

  body {
    background-color: ${({ theme }) => theme.base};
    color: ${({ theme }) => theme.text};
    font-family: "Martian Mono", system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    padding: 16px;
    min-height: 100vh;
    min-height: 100dvh;

    @media (max-width: 768px) {
      padding: 8px;
      line-height: 1.4;
    }
  }

  a {
    color: ${({ theme }) => theme.blue};
  }
`;
