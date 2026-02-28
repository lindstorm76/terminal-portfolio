import styled from "styled-components";
import type { LineStyle } from "../providers/HistoryContext";

const Primary = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ theme }) => theme.mauve};
`;

const Secondary = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ theme }) => theme.teal};
`;

const System = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ theme }) => theme.maroon};
`;

const Bold = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  font-weight: bold;
`;

const Default = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
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
  bold: Bold,
  default: Default,
};
