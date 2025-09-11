import styled from "styled-components";

import IconWrapper from "../IconWrapper";

export const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
`;

export const Background = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  filter: blur(16px) brightness(0.3);
`;

export const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  align-self: stretch;
  z-index: 1;
`;

export const Cover = styled.img`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
`;

export const SongInfoRight = styled.div`
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

export const Description = styled.h2`
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

export const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  overflow: hidden;
  z-index: 1;
`;

export const Overview = styled.p<{ $showAll: boolean }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.onBackgroundSubtle};
  text-overflow: ellipsis;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  ${({ $showAll }) =>
    $showAll
      ? `
      -webkit-line-clamp: unset;
      overflow: visible;
    `
      : `
      -webkit-line-clamp: 3;
      overflow: hidden;`}
`;

export const ShowAllButton = styled.button`
  display: flex;
  padding: 5px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.onBackground};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: none;
  border: none;
  cursor: pointer;
`;

export const ArrowDropDownIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
`;
