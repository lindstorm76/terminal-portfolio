import styled from "styled-components";
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

const LineWrapper = styled.div``;

const History = () => {
  const { lines, addLine } = useHistory();

  useBootSequence(() => {
    addLine([
      { text: "For a list of available commands, type `" },
      { text: "help", style: "primary" },
      { text: "`." },
    ]);
    addLine([
      { text: "relaxed-haibt", style: "primary" },
      { text: "@" },
      { text: "terminal.thanapong.dev", style: "secondary" },
      { text: ":~$" },
    ]);
  });

  return lines.map((line) => (
    <LineWrapper key={line.id}>
      {line.parts.map((part, i) => (
        <LinePart key={i} part={part} />
      ))}
    </LineWrapper>
  ));
};

export default History;
