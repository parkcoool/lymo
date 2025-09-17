import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

export const Wrapper = styled.button<{ $coverUrl: string }>`
  display: flex;
  width: 140px;
  height: 140px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 8px;
  background: url(${(props) => props.$coverUrl}) lightgray 50% / cover no-repeat;
  cursor: pointer;
  border: none;
  padding: 0;
  overflow: hidden;
  position: relative;
`;

export const Cover = styled.img`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  object-fit: cover;
`;

export const CoverSkeleton = styled(Skeleton)`
  width: 100%;
  height: 100%;
`;

export const TitleWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
`;

export const Title = styled.h1`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  overflow: hidden;
  color: #fff;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  text-align: left;
`;
