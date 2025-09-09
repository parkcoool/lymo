import styled from "styled-components";

export const Wrapper = styled.button<{ coverUrl: string }>`
  display: flex;
  width: 140px;
  height: 140px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 8px;
  background: url(${(props) => props.coverUrl}) lightgray 50% / cover no-repeat;
  cursor: pointer;
  border: none;
`;

export const TitleWrapper = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  align-self: stretch;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

export const Title = styled.span`
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
`;
