import styled from "styled-components";

export const StyledBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export const StyledRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;
export const StyledRowHeader = styled.div`
  display: flex;
  margin-right: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSize["sm"]};
`;
export const StyledRowContent = styled.div`
  display: flex;
`;
export const StyledResultsWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: scroll;
  position: relative;
`;
export const StyledResults = styled.div`
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

export const StyledResultHeading = styled.h6`
  width: 100%;
`;
export const StyledResultItem = styled.div`
  display: inline-flex;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.space[1]};
`;