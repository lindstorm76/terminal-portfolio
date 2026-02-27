import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory, HistoryProvider } from "../providers/HistoryContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HistoryProvider>{children}</HistoryProvider>
);

describe("useHistory", () => {
  it("throws without provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useHistory())).toThrow(
      "useHistory must be used within HistoryProvider",
    );

    spy.mockRestore();
  });

  it("initializes with empty lines", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    expect(result.current.lines).toHaveLength(0);
  });

  it("addLine appends a new line", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    act(() => {
      result.current.addLine([{ text: "hello" }]);
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].parts[0].text).toBe("hello");
  });

  it("addText appends a simple text line", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    act(() => {
      result.current.addText("hello world");
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].parts[0].text).toBe("hello world");
  });

  it("addText applies style", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    act(() => {
      result.current.addText("error", "primary");
    });

    expect(result.current.lines[0].parts[0]).toEqual({
      text: "error",
      style: "primary",
    });
  });

  it("clear removes all lines", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    act(() => {
      result.current.addText("line 1");
      result.current.addText("line 2");
    });

    expect(result.current.lines).toHaveLength(2);

    act(() => {
      result.current.clear();
    });

    expect(result.current.lines).toHaveLength(0);
  });

  it("generates unique ids for each line", () => {
    const { result } = renderHook(() => useHistory(), { wrapper });

    act(() => {
      result.current.addText("first");
      result.current.addText("second");
    });

    expect(result.current.lines[0].id).not.toBe(result.current.lines[1].id);
  });
});
