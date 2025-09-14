import styled from "styled-components";

import IconWrapper from "../IconWrapper";

export const Container = styled.div<{ $isActive: boolean }>`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  border-radius: 16px;
  ${({ $isActive }) =>
    $isActive &&
    `background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );`}
`;

export const SentenceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

export const SummaryWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.surface}80;
`;

export const Summary = styled.p`
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  text-align: left;
  white-space: pre-wrap;
  align-self: stretch;
`;

export const SummaryFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const SummaryActionIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.onSurfaceSubtle};
`;
