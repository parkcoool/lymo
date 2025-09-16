import { useSuspenseQuery } from "@tanstack/react-query";
import { MdSearch } from "react-icons/md";

import searchSongs from "~/apis/searchSongs";

import * as S from "./SearchResultHeader.styles";

interface SearchResultHeaderProps {
  query: string;
}

export default function SearchResultHeader({ query }: SearchResultHeaderProps) {
  const { data: searchResults } = useSuspenseQuery({
    queryKey: ["searchResults", query],
    queryFn: async () => searchSongs({ query }),
  });

  return (
    <S.Header>
      <S.SearchIconWrapper>
        <MdSearch />
      </S.SearchIconWrapper>
      {/* 검색 결과가 있을 때 */}
      {searchResults.length > 0 && (
        <S.HeaderText>
          <S.HeaderTextMark>{`"${query}"`}</S.HeaderTextMark>에 대한 검색 결과{" "}
          {searchResults.length}건을 찾았습니다.
        </S.HeaderText>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchResults.length === 0 && (
        <S.HeaderText>
          <S.HeaderTextMark>{`"${query}"`}</S.HeaderTextMark>에 대한 검색 결과가
          없습니다.
        </S.HeaderText>
      )}
    </S.Header>
  );
}
