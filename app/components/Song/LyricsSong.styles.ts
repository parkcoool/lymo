import styled from "styled-components";

export const Wrapper = styled.div<{ $coverColor: string }>`
  display: flex;
  width: 200px;
  min-height: 300px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.6) 10%, rgba(0, 0, 0, 0.8) 90%),
    ${(props) => props.$coverColor};
`;

export const Info = styled.div`
  display: flex;
  padding: 15px 10px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const LyricsWrapper = styled.div`
  display: flex;
  height: 180px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

export const Footer = styled.div`
  display: flex;
  padding: 10px;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

export const Cover = styled.img<{ coverUrl: string }>`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  background: url(${(props) => props.coverUrl}) lightgray 50% / cover no-repeat;
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
`;

export const Artist = styled.h2`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  align-self: stretch;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.onBackgroundSubtle};
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const Lyrics = styled.p`
  align-self: stretch;
  color: ${({ theme }) => theme.colors.onBackground};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
`;

export const PlayCircleIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.onBackground};
`;
