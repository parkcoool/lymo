import styled from "styled-components";

import Skeleton from "~/components/Skeleton";

const DetailSongSkeleton = styled(Skeleton)`
  height: 50px;
  border-radius: 8px;
  flex: 0 0 50px;
  margin: 10px;
  align-self: stretch;
`;

export default function SearchResultListSkeleton() {
  return (
    <>
      <DetailSongSkeleton />
      <DetailSongSkeleton />
      <DetailSongSkeleton />
    </>
  );
}
