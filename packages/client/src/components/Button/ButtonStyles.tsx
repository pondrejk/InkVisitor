import styled from "styled-components";
import { space1, space2, space3 } from "Theme/constants";

interface IButtonStyle {
  hasIcon?: boolean;
  inverted: boolean;
  color: string;
}
export const StyledButton = styled.button<IButtonStyle>`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes["xs"]};
  font-weight: 900;
  padding: ${space2} ${({ hasIcon }) => (hasIcon ? space2 : space3)};
  border: 2px solid ${({ theme, color }) => theme.colors[color]};
  color: ${({ theme, color, inverted }) =>
    inverted ? theme.colors[color] : theme.colors["white"]};
  background-color: ${({ theme, color, inverted }) =>
    inverted ? theme.colors["white"] : theme.colors[color]};
  cursor: pointer;
  :focus {
    outline: 0;
  }
`;