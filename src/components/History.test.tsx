import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import History from "./History";
import { catppuccinMacchiato as theme } from "../styles/theme";

const renderComponent = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("History", () => {
  it("renders the welcome message", () => {
    renderComponent(<History />);

    expect(
      screen.getByText("For a list of available commands, type `"),
    ).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("`.")).toBeInTheDocument();
  });

  it("applies primary style to the help command", () => {
    renderComponent(<History />);

    const helpText = screen.getByText("help");
    expect(helpText).toHaveStyle({ color: theme.mauve });
  });

  it("renders the prompt line with username and domain", () => {
    renderComponent(<History />);

    expect(screen.getByText("@")).toBeInTheDocument();
    expect(screen.getByText("terminal.thanapong.dev")).toBeInTheDocument();
    expect(screen.getByText(":~$")).toBeInTheDocument();
  });
});
