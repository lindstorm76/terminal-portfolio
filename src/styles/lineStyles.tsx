import styled from "styled-components";
import type { LineStyle } from "../hooks/useHistory";

const Primary = styled.span`
  color: ${({ theme }) => theme.mauve};
`;

const Secondary = styled.span`
  color: ${({ theme }) => theme.sapphire};
  font-weight: bold;
`;

const Default = styled.span`
  white-space: pre;
`;

export const LINE_STYLE_MAP: Record<
  LineStyle,
  React.ComponentType<React.PropsWithChildren>
> = {
  primary: Primary,
  secondary: Secondary,
  default: Default,
};
