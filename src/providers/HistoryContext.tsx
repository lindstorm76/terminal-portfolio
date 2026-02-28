import { createContext, useCallback, useContext, useState } from "react";

export type LineStyle = "primary" | "secondary" | "system" | "bold" | "default";

export type LinePart = {
  text: string;
  style?: LineStyle;
  display?: "inline" | "block";
};

export type Line = {
  id: string;
  parts: LinePart[];
};

const HistoryContext = createContext<ReturnType<typeof useHistoryState> | null>(
  null,
);

let lineCounter = 0;

function createLineId(): string {
  return `line-${++lineCounter}`;
}

function useHistoryState(initialLines: Line[] = []) {
  const [lines, setLines] = useState<Line[]>(initialLines);

  const addLine = useCallback((parts: LinePart[]) => {
    setLines((prev) => [...prev, { id: createLineId(), parts }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  return { lines, setLines, addLine, clear };
}

export const HistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const history = useHistoryState();
  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context)
    throw new Error("useHistory must be used within HistoryProvider");
  return context;
}
