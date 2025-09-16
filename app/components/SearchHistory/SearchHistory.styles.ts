import styled from "styled-components";

import IconWrapper from "../IconWrapper";

export const Wrapper = styled.div`
  display: flex;
  padding: 15px 30px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HistoryIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.onBackground};
`;

export const Text = styled.span`
  color: ${(props) => props.theme.colors.onBackgroundSubtle};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
`;

export const Mark = styled.mark`
  color: ${(props) => props.theme.colors.onBackground};
  font-weight: 700;
  background-color: transparent;
`;

export const ActionIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.onBackground};
`;
