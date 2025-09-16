import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";

export const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  padding: 0 15px;
  box-sizing: border-box;
  align-items: center;
  gap: 10px;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.colors.background};
`;

export const LeftIconWrapper = styled(IconWrapper)`
  width: 36px;
  height: 36px;
  color: ${({ theme }) => theme.colors.onBackground};
`;

export const SearchInput = styled.div`
  display: flex;
  padding: 0 15px;
  height: 50px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  gap: 10px;
`;

export const TextInput = styled.input.attrs({
  type: "search",
})`
  background: none;
  border: none;
  width: 100%;
  height: 100%;
  outline: none;
`;

export const SearchIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.onSurface};
`;
