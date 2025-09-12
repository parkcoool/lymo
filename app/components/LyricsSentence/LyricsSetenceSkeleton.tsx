import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

const SetenceSkeleton = styled(Skeleton)`
  width: 70%;
  border-radius: 8px;
  flex: 0 0 24px;
`;

export default function LyricsSetenceSkeleton() {
  return (
    <>
      <SetenceSkeleton />
      <SetenceSkeleton />
      <SetenceSkeleton />
      <SetenceSkeleton />
      <SetenceSkeleton />
    </>
  );
}
