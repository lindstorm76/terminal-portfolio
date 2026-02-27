import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory } from "./useHistory";

describe("useHistory", () => {
  it("initializes welcome lines with correct ids", () => {
    const { result } = renderHook(() => useHistory());

    expect(result.current.lines).toHaveLength(2);
    expect(result.current.lines[0].id).toBe("welcome");
    expect(result.current.lines[1].id).toBe("help");
  });

  it("welcome line contains help command in primary style", () => {
    const { result } = renderHook(() => useHistory());
    const welcomeParts = result.current.lines[0].parts;

    expect(welcomeParts).toContainEqual({
      text: "For a list of available commands, type `",
    });
    expect(welcomeParts).toContainEqual({
      text: "help",
      style: "primary",
    });
    expect(welcomeParts).toContainEqual({
      text: "`.",
    });
  });

  it("help line contains correct shell prompt in both text and styles", () => {
    const { result } = renderHook(() => useHistory());
    const helpParts = result.current.lines[1].parts;

    expect(helpParts).toContainEqual({
      text: expect.any(String),
      style: "primary",
    });
    expect(helpParts).toContainEqual({
      text: "@",
    });
    expect(helpParts).toContainEqual({
      text: "terminal.thanapong.dev",
      style: "secondary",
    });
    expect(helpParts).toContainEqual({
      text: ":~$",
    });
  });

  it("addText appends a new line", () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addText("hello world");
    });

    expect(result.current.lines).toHaveLength(3);
    expect(result.current.lines[2].parts[0].text).toBe("hello world");
  });

  it("clear removes all lines", () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.clear();
    });

    expect(result.current.lines).toHaveLength(0);
  });

  it("accepts custom initial lines", () => {
    const custom = [{ id: "testInitialLine", parts: [{ text: "hi" }] }];
    const { result } = renderHook(() => useHistory(custom));

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].id).toBe("testInitialLine");
  });
});
