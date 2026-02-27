import styled from "styled-components";
import { useHistory, type LinePart } from "../hooks/useHistory";
import { LINE_STYLE_MAP } from "../styles/lineStyles";

const LinePart = ({ part }: { part: LinePart }) => {
  const Component = LINE_STYLE_MAP[part.style ?? "default"];
  return <Component>{part.text}</Component>;
};

const LineWrapper = styled.div``;

const History = () => {
  const { lines } = useHistory();

  return lines.map((line) => (
    <LineWrapper key={line.id}>
      {line.parts.map((part, i) => (
        <LinePart key={i} part={part} />
      ))}
    </LineWrapper>
  ));
};

export default History;
