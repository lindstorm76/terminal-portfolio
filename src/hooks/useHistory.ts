import { useState, useCallback } from "react";

export type LineStyle = "primary" | "secondary" | "default";

export type LinePart = {
  text: string;
  style?: LineStyle;
};

export type Line = {
  id: string;
  parts: LinePart[];
};

let lineCounter = 0;

function createLineId(): string {
  return `line-${++lineCounter}`;
}

const WELCOME_LINES: Line[] = [
  {
    id: "welcome",
    parts: [
      { text: "For a list of available commands, type `" },
      { text: "help", style: "primary" },
      { text: "`." },
    ],
  },
  {
    id: "help",
    parts: [
      { text: "relaxed-haibt", style: "primary" },
      { text: "@" },
      { text: "terminal.thanapong.dev", style: "secondary" },
      { text: ":~$" },
    ],
  },
];

export function useHistory(initialLines: Line[] = [...WELCOME_LINES]) {
  const [lines, setLines] = useState<Line[]>(initialLines);

  const addLine = useCallback((parts: LinePart[]) => {
    setLines((prev) => [...prev, { id: createLineId(), parts }]);
  }, []);

  const addText = useCallback((text: string, style?: LineStyle) => {
    setLines((prev) => [
      ...prev,
      { id: createLineId(), parts: [{ text, style }] },
    ]);
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  return { lines, setLines, addLine, addText, clear };
}
