import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.base};
    color: ${({ theme }) => theme.text};
    font-family: "Martian Mono", system-ui, -apple-system, sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }

  a {
    color: ${({ theme }) => theme.blue};
  }
`;
