import { motion } from "motion/react";
import styled from "styled-components";

import IconWrapper from "~/components/IconWrapper";

import Skeleton from "../Skeleton";

export const Wrapper = styled(motion.div).attrs({
  layout: true,
})`
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

export const Background = styled(motion.img).attrs({ layout: true })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  filter: blur(16px) brightness(0.3);
`;

export const SongInfo = styled(motion.div).attrs({
  layout: true,
})`
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

export const CoverSkeleton = styled(Skeleton)`
  width: 50px;
  height: 50px;
  border-radius: 8px;
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

export const TitleSkeleton = styled(Skeleton)`
  width: 150px;
  height: 16px;
  border-radius: 4px;
  opacity: 0.5;
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
  line-height: 100%;
  text-align: left;
`;

export const DescriptionSkeleton = styled(Skeleton)`
  width: 250px;
  height: 16px;
  border-radius: 4px;
  opacity: 0.5;
`;

export const OverviewWrapper = styled(motion.div).attrs({
  layout: true,
})<{
  $showAll: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  overflow: hidden;
  z-index: 1;

  ${({ $showAll }) => !$showAll && `max-height: 96px;`}
`;

export const Overview = styled(motion.p).attrs({ layout: true })`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.onBackgroundSubtle};
  text-overflow: ellipsis;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const OverviewSkeleton = styled(Skeleton)`
  width: 100%;
  height: 16px;
  border-radius: 4px;
  opacity: 0.5;
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
  z-index: 1;
`;

export const ArrowDropDownIconWrapper = styled(IconWrapper)`
  width: 24px;
  height: 24px;
`;
