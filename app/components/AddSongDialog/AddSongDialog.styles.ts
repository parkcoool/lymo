import styled from "styled-components";

import IconWrapper from "../IconWrapper";

import type { AddSongDialogVariant } from "./AddSongDialog";

export const Wrapper = styled.div<{ $variant: AddSongDialogVariant }>`
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  background-color: ${({ $variant, theme }) =>
    $variant === "normal" ? theme.colors.secondaryBackground : "transparent"};
`;

export const Header = styled.div<{ $variant: AddSongDialogVariant }>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $variant }) =>
    $variant === "normal" ? "flex-start" : "center"};
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const Title = styled.div<{ $variant: AddSongDialogVariant }>`
  display: flex;
  gap: 5px;
  color: ${({ $variant, theme }) =>
    $variant === "normal"
      ? theme.colors.onSecondaryBackground
      : theme.colors.onBackground};
  justify-content: ${({ $variant }) =>
    $variant === "normal" ? "flex-start" : "center"};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  align-self: stretch;
  line-height: normal;
`;

export const MusicNoteAddIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
`;

export const Subtitle = styled.div<{ $variant: AddSongDialogVariant }>`
  color: ${({ $variant, theme }) =>
    $variant === "normal"
      ? theme.colors.onSecondaryBackgroundSubtle
      : theme.colors.onBackgroundSubtle};
  text-align: ${({ $variant }) => ($variant === "normal" ? "left" : "center")};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const ButtonContainer = styled.div<{ $variant: AddSongDialogVariant }>`
  display: flex;
  justify-content: ${({ $variant }) =>
    $variant === "normal" ? "flex-start" : "center"};
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const Button = styled.button`
  display: flex;
  padding: 10px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  border-radius: 16px;
  cursor: pointer;
`;

export const ButtonIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
`;
