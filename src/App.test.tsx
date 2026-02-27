import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUserInfo } from "./hooks/useUserInfo";

describe("useUserInfo", () => {
  it("returns user info with a username and domain", () => {
    const { result } = renderHook(() => useUserInfo());

    expect(result.current).toEqual({
      username: expect.any(String),
      domain: "terminal.thanapong.dev",
    });
  });

  it("returns a stable reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useUserInfo());

    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
