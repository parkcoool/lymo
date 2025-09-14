import { motion } from "motion/react";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 90px 0 100px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  align-self: stretch;
`;

export const SongOverviewWrapper = styled.div`
  align-self: stretch;
  margin: 0 10px;
`;

export const Lyrics = styled(motion.div).attrs({
  layout: true,
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

export const Footer = styled.div<{
  $backgroundColor: string;
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
  z-index: 101;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: var(--progress, 100%);
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
