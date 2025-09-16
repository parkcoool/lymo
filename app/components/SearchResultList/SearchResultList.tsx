import { useSuspenseQuery } from "@tanstack/react-query";

import searchSongs from "~/apis/searchSongs";
import { DetailSong } from "~/components/Song";
import usePlayerStore from "~/contexts/usePlayerStore";

import AddSongDialog from "../AddSongDialog";

import * as S from "./SearchResultList.styles";

interface SearchResultListProps {
  query: string;
}

export default function SearchResultList({ query }: SearchResultListProps) {
  const { song } = usePlayerStore();
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

      {/* 검색 결과가 있을 때 */}
      {searchResults?.length > 0 && (
        <S.NormalDialogWrapper
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 1 }}
        >
          <S.StyledNormalDialog $long={song !== null} variant="normal" />
        </S.NormalDialogWrapper>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchResults?.length === 0 && (
        <S.ExtendedDialogWrapper>
          <AddSongDialog variant="extended" />
        </S.ExtendedDialogWrapper>
      )}
    </>
  );
}
