import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, useThemeContext } from "./ThemeContext";

const Consumer = () => {
  const { themeName, setTheme } = useThemeContext();
  return (
    <>
      <span data-testid="theme-name">{themeName}</span>
      <button onClick={() => setTheme("mocha")}>set mocha</button>
      <button onClick={() => setTheme("latte")}>set latte</button>
    </>
  );
};

const renderConsumer = () =>
  render(
    <ThemeContextProvider>
      <Consumer />
    </ThemeContextProvider>,
  );

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to macchiato when localStorage is empty", () => {
    renderConsumer();
    expect(screen.getByTestId("theme-name")).toHaveTextContent("macchiato");
  });

  it("loads a persisted theme from localStorage on mount", () => {
    localStorage.setItem("theme", "mocha");
    renderConsumer();
    expect(screen.getByTestId("theme-name")).toHaveTextContent("mocha");
  });

  it("falls back to macchiato for an invalid localStorage value", () => {
    localStorage.setItem("theme", "notatheme");
    renderConsumer();
    expect(screen.getByTestId("theme-name")).toHaveTextContent("macchiato");
  });

  it("setTheme updates the active theme name", () => {
    renderConsumer();
    fireEvent.click(screen.getByText("set mocha"));
    expect(screen.getByTestId("theme-name")).toHaveTextContent("mocha");
  });

  it("setTheme persists the selection to localStorage", () => {
    renderConsumer();
    fireEvent.click(screen.getByText("set latte"));
    expect(localStorage.getItem("theme")).toBe("latte");
  });

  it("setTheme overwrites a previously saved theme", () => {
    localStorage.setItem("theme", "frappe");
    renderConsumer();
    fireEvent.click(screen.getByText("set mocha"));
    expect(localStorage.getItem("theme")).toBe("mocha");
    expect(screen.getByTestId("theme-name")).toHaveTextContent("mocha");
  });
});
