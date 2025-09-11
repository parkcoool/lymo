import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 90px 10px 100px 10px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  align-self: stretch;
`;

export const Lyrics = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

export const Footer = styled.div<{
  $backgroundColor: string;
  $percentage: number;
}>`
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: ${(props) => 100 - props.$percentage}%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
