import styled from "styled-components";

import IconWrapper from "../IconWrapper";

export const Wrapper = styled.form`
  display: flex;
  width: 100vw;
  padding: 30px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  border-radius: 16px 16px 0 0;
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.onSecondaryBackgroundSubtle};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const LabelIconWrapper = styled(IconWrapper)`
  width: 20px;
  height: 20px;
`;

export const Input = styled.input.attrs({ type: "text" })`
  width: 100%;
  display: flex;
  padding: 15px;
  align-items: center;
  align-self: stretch;
  border-radius: 32px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  box-sizing: border-box;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  align-self: stretch;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.onSecondaryBackgroundSubtle};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  align-self: stretch;
`;

export const Button = styled.button.attrs({ type: "submit" })`
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
