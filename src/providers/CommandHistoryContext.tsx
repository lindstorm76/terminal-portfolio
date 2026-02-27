import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useHistory, type LinePart } from "./HistoryContext";

interface CommandHistoryState {
  commands: string[];
  addCommand: (command: string) => void;
  clear: () => void;
  showHistory: () => void;
}

const CommandHistoryContext = createContext<CommandHistoryState | null>(null);

export const CommandHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { addLine } = useHistory();
  const [commands, setCommands] = useState<string[]>([]);
  const commandsRef = useRef<string[]>([]);

  const addCommand = useCallback((command: string) => {
    setCommands((prev) => {
      const next = [...prev, command];

      commandsRef.current = next;

      return next;
    });
  }, []);

  const clear = () => {
    setCommands([]);
    commandsRef.current = [];
  };

  const showHistory = () => {
    addLine(
      commandsRef.current.map(
        (command): LinePart => ({ text: command, display: "block" }),
      ),
    );
  };

  return (
    <CommandHistoryContext.Provider
      value={{ commands, addCommand, clear, showHistory }}
    >
      {children}
    </CommandHistoryContext.Provider>
  );
};

export function useCommandHistory() {
  const context = useContext(CommandHistoryContext);
  if (!context)
    throw new Error(
      "useCommandHistory must be used within CommandHistoryProvider",
    );
  return context;
}
