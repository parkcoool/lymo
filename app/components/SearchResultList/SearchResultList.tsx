import { useSuspenseQuery } from "@tanstack/react-query";

import searchSongs from "~/apis/searchSongs";
import { DetailSong } from "~/components/Song";

interface SearchResultListProps {
  query: string;
}

export default function SearchResultList({ query }: SearchResultListProps) {
  const { data: searchResults } = useSuspenseQuery({
    queryKey: ["searchResults", query],
    queryFn: async () => searchSongs({ query }),
  });

  return (
    <>
      {searchResults?.map((song) => (
        <DetailSong
          key={song.objectID}
          id={song.objectID}
          title={song.title}
          artist={song.artist}
          duration={song.duration}
          coverUrl={song.coverUrl}
        />
      ))}
    </>
  );
}
