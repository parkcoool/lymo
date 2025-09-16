import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 70px 0 80px 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
`;

export const Header = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const SearchIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.onBackgroundSubtle};
`;

export const HeaderText = styled.span`
  color: ${(props) => props.theme.colors.onBackgroundSubtle};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const HeaderTextMark = styled.mark`
  color: ${(props) => props.theme.colors.onBackground};
  background-color: transparent;
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`;
