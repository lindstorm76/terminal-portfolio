import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCommandHistory, CommandHistoryProvider } from "./CommandHistoryContext";
import { HistoryProvider, useHistory } from "./HistoryContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HistoryProvider>
    <CommandHistoryProvider>{children}</CommandHistoryProvider>
  </HistoryProvider>
);

describe("useCommandHistory", () => {
  it("throws without provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useCommandHistory())).toThrow(
      "useCommandHistory must be used within CommandHistoryProvider",
    );

    spy.mockRestore();
  });

  it("initializes with empty commands", () => {
    const { result } = renderHook(() => useCommandHistory(), { wrapper });

    expect(result.current.commands).toHaveLength(0);
  });

  it("addCommand appends a command", () => {
    const { result } = renderHook(() => useCommandHistory(), { wrapper });

    act(() => {
      result.current.addCommand("help");
    });

    expect(result.current.commands).toEqual(["help"]);
  });

  it("addCommand appends multiple commands in order", () => {
    const { result } = renderHook(() => useCommandHistory(), { wrapper });

    act(() => {
      result.current.addCommand("help");
      result.current.addCommand("whoami");
      result.current.addCommand("about");
    });

    expect(result.current.commands).toEqual(["help", "whoami", "about"]);
  });

  it("clear removes all commands", () => {
    const { result } = renderHook(() => useCommandHistory(), { wrapper });

    act(() => {
      result.current.addCommand("help");
      result.current.addCommand("whoami");
    });

    expect(result.current.commands).toHaveLength(2);

    act(() => {
      result.current.clear();
    });

    expect(result.current.commands).toHaveLength(0);
  });

  it("showHistory adds commands as lines to history", () => {
    const { result } = renderHook(
      () => ({ cmd: useCommandHistory(), hist: useHistory() }),
      { wrapper },
    );

    act(() => {
      result.current.cmd.addCommand("help");
      result.current.cmd.addCommand("whoami");
    });

    act(() => {
      result.current.cmd.showHistory();
    });

    const lines = result.current.hist.lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].parts).toEqual([
      { text: "help", display: "block" },
      { text: "whoami", display: "block" },
    ]);
  });

  it("showHistory reflects commands added in the same tick", () => {
    // Verifies the commandsRef fix: showHistory must see the command
    // added immediately before it in the same synchronous call, not stale state.
    const { result } = renderHook(
      () => ({ cmd: useCommandHistory(), hist: useHistory() }),
      { wrapper },
    );

    act(() => {
      result.current.cmd.addCommand("history");
      result.current.cmd.showHistory();
    });

    const parts = result.current.hist.lines[0].parts;
    expect(parts.some((p) => p.text === "history")).toBe(true);
  });

  it("showHistory after clear produces empty output", () => {
    const { result } = renderHook(
      () => ({ cmd: useCommandHistory(), hist: useHistory() }),
      { wrapper },
    );

    act(() => {
      result.current.cmd.addCommand("help");
      result.current.cmd.clear();
      result.current.cmd.showHistory();
    });

    const lines = result.current.hist.lines;
    expect(lines[0].parts).toHaveLength(0);
  });
});
