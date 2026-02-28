import { LINE_STYLE_MAP } from "../styles/lineStyles";
import { useBootSequence } from "../hooks/useBootSequence";
import { useHistory, type LinePart } from "../providers/HistoryContext";

const LinePart = ({ part }: { part: LinePart }) => {
  const Component = LINE_STYLE_MAP[part.style ?? "default"];
  return (
    <Component
      style={part.display === "block" ? { display: "block" } : undefined}
    >
      {part.text}
    </Component>
  );
};

interface HistoryProps {
  onBootComplete?: () => void;
}

const History = ({ onBootComplete }: HistoryProps) => {
  const { lines, addLine } = useHistory();

  useBootSequence(() => {
    addLine([
      { text: "For a list of available commands, type " },
      { text: "help", style: "primary" },
    ]);
    onBootComplete?.();
  });

  return lines.map((line) => (
    <div key={line.id}>
      {line.parts.map((part, i) => (
        <LinePart key={i} part={part} />
      ))}
    </div>
  ));
};

export default History;
