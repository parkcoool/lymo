import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

const CompactSongSkeleton = styled(Skeleton)`
  width: 140px;
  height: 140px;
  border-radius: 8px;
  flex: 0 0 140px;
`;

export default function PopularSongListSkeleton() {
  return (
    <>
      <CompactSongSkeleton />
      <CompactSongSkeleton />
      <CompactSongSkeleton />
    </>
  );
}
