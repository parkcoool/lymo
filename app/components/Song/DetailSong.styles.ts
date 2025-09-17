import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";
import Skeleton from "~/components/Skeleton";

export const Wrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  box-sizing: border-box;
  align-items: center;
  gap: 15px;
  width: 100%;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1 0 0;
`;

export const Cover = styled.img`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
`;

export const CoverSkeleton = styled(Skeleton)`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  flex: 1 0 0;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
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

export const PlayCircleIconWrapper = styled(IconWrapper)`
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.onBackground};
`;
