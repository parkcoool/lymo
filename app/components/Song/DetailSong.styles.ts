import styled from "styled-components";

export const Wrapper = styled.button`
  display: flex;
  padding: 20px 30px;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  border: none;
  background: none;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1 0 0;
`;

export const Cover = styled.img<{ coverUrl: string }>`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  background: url(${(props) => props.coverUrl}) lightgray 50% / cover no-repeat;
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

export const Title = styled.span`
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

export const Description = styled.span`
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
`;

export const PlayCircleIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.onBackground};
`;
