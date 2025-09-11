import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  align-self: stretch;
`;

export const Sentence = styled.p<{ $isActive: boolean }>`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.onBackground : theme.colors.onBackgroundSubtle};
`;

export const Translation = styled.p<{ $isActive: boolean }>`
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.onBackground : theme.colors.onBackgroundSubtle};
`;
