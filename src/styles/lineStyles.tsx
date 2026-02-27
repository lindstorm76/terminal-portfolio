import styled from "styled-components";
import type { LineStyle } from "../providers/HistoryContext";

const Primary = styled.span`
  white-space: pre;
  color: ${({ theme }) => theme.mauve};
`;

const Secondary = styled.span`
  white-space: pre;
  color: ${({ theme }) => theme.teal};
`;

const System = styled.span`
  white-space: pre;
  color: ${({ theme }) => theme.maroon};
`;

const Default = styled.span`
  white-space: pre;
`;

export const LINE_STYLE_MAP: Record<
  LineStyle,
  React.ComponentType<
    React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>
  >
> = {
  primary: Primary,
  secondary: Secondary,
  system: System,
  default: Default,
};
