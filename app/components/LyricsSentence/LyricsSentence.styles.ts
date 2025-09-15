import { motion } from "motion/react";
import styled from "styled-components";

export const Wrapper = styled(motion.button).attrs({
  whileHover: { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" },
  whileTap: { scale: 0.98, backgroundColor: "rgba(255, 255, 255, 0.1)" },
})`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  align-self: stretch;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  border-radius: 16px;
  padding: 10px;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
`;

export const Sentence = styled.p<{ $isActive: boolean }>`
  font-size: 24px;
  font-style: normal;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  line-height: 120%;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.onBackground : theme.colors.onBackgroundSubtle};
  transition:
    font-weight 0.2s ease,
    color 0.2s ease;
`;

export const Translation = styled.p<{ $isActive: boolean }>`
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.onBackground : theme.colors.onBackgroundSubtle};
  transition:
    font-weight 0.2s ease,
    color 0.2s ease;
`;
