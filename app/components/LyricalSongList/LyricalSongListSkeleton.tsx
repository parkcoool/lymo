import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

const LyricalSongSkeleton = styled(Skeleton)`
  width: 200px;
  height: 350px;
  border-radius: 8px;
  flex: 0 0 140px;
`;

export default function LyricalSongListSkeleton() {
  return (
    <>
      <LyricalSongSkeleton />
      <LyricalSongSkeleton />
      <LyricalSongSkeleton />
    </>
  );
}
