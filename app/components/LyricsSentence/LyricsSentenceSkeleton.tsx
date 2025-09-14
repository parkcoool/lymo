import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

const SentenceSkeleton = styled(Skeleton)`
  width: 70%;
  border-radius: 8px;
  flex: 0 0 24px;
`;

export default function LyricsSentenceSkeleton() {
  return (
    <>
      <SentenceSkeleton />
      <SentenceSkeleton />
      <SentenceSkeleton />
      <SentenceSkeleton />
      <SentenceSkeleton />
    </>
  );
}
