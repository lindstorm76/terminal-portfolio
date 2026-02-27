import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { catppuccinMacchiato as theme } from "../styles/theme";
import { HistoryProvider } from "../providers/HistoryContext";
import History from "./History";

const renderComponent = () => {
  return render(
    <ThemeProvider theme={theme}>
      <HistoryProvider>
        <History />
      </HistoryProvider>
    </ThemeProvider>,
  );
};

describe("History", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders boot sequence lines", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(
      screen.getByText("Initializing system kernel..."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Establishing secure tunnel/)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(screen.getByText(/WELCOME TO FSOCIETY NODE/)).toBeInTheDocument();
  });

  it("renders welcome message after boot sequence completes", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(
      screen.getByText("For a list of available commands, type `"),
    ).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("`.")).toBeInTheDocument();
  });

  it("renders prompt line after boot sequence completes", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(screen.getByText("@")).toBeInTheDocument();
    expect(screen.getByText("terminal.thanapong.dev")).toBeInTheDocument();
    expect(screen.getByText(":~$")).toBeInTheDocument();
  });

  it("applies primary style to help command", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    const helpText = screen.getByText("help");
    expect(helpText).toHaveStyle({ color: theme.mauve });
  });

  it("applies secondary style to domain", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    const domain = screen.getByText("terminal.thanapong.dev");
    expect(domain).toHaveStyle({ color: theme.teal });
  });

  it("does not show welcome message before boot finishes", async () => {
    renderComponent();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.queryByText("help")).not.toBeInTheDocument();
  });
});
