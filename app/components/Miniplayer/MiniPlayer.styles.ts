import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";

export const Wrapper = styled.div<{ $coverColor: string }>`
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  background: ${({ $coverColor }) => $coverColor}4d;
  backdrop-filter: blur(16px);
  border-radius: 16px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
`;

export const Right = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  gap: 10px;
`;

export const Cover = styled.img`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 16px;
  object-fit: cover;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 3px;
  flex: 1 0 0;
`;

export const Title = styled.h1`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.onBackground};
  text-overflow: ellipsis;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
  text-align: left;
`;

export const Artist = styled.h2`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.onBackgroundSubtle};
  text-overflow: ellipsis;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: left;
`;

export const ActionIconWrapper = styled(IconWrapper)`
  width: 36px;
  height: 36px;
  color: ${({ theme }) => theme.colors.onBackground};
`;
