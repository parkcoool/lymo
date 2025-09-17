import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
`;

export const SentenceSkeleton = styled(Skeleton)`
  width: 70%;
  border-radius: 8px;
  flex: 0 0 24px;
`;

export const TranslationSkeleton = styled(Skeleton)`
  width: 50%;
  border-radius: 8px;
  flex: 0 0 20px;
`;
