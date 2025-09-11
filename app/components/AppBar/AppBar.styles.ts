import { motion } from "motion/react";
import styled from "styled-components";

import IconWrapper from "../IconWrapper";

export const Wrapper = styled.div`
  display: flex;
  height: 70px;
  padding: 0 15px;
  box-sizing: border-box;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
  background: ${({ theme }) =>
    `linear-gradient(
      180deg,
      ${theme.colors.dynamicBackground ?? theme.colors.background}ff 25%,
      ${theme.colors.dynamicBackground ?? theme.colors.background}00 100%
    )`};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background 0.3s ease;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
`;

export const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

export const LeftIconWrapper = styled(IconWrapper)`
  width: 36px;
  height: 36px;
  color: ${({ theme }) => theme.colors.onBackground};
`;

export const SearchIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const PersonIconWrapper = styled(IconWrapper)`
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.onBackground};
`;

export const SearchBox = styled(motion.button)`
  display: flex;
  padding: 0 15px;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 32px;
  opacity: 0.8;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurfaceSubtle};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  cursor: pointer;
  white-space: nowrap;
`;

export const SongTitle = styled(motion.h1)`
  color: ${({ theme }) => theme.colors.onBackground};
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  white-space: nowrap;
`;
