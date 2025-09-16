import { Suspense } from "react";
import { MdSearch } from "react-icons/md";

import {
  SearchResultList,
  SearchResultListSkeleton,
} from "~/components/SearchResultList";

import type { Route } from "./+types/SearchResult";
import * as S from "./SearchResult.styles";

export default function SearchResult({ params }: Route.LoaderArgs) {
  const query = params.query;

  return (
    <S.Container>
      <S.Header>
        <S.SearchIconWrapper>
          <MdSearch />
        </S.SearchIconWrapper>
        <S.HeaderText>
          <S.HeaderTextMark>{`"${query}"`}</S.HeaderTextMark>에 대한 검색
          결과입니다.
        </S.HeaderText>
      </S.Header>

      <S.ResultsContainer>
        <Suspense fallback={<SearchResultListSkeleton />}>
          <SearchResultList query={query} />
        </Suspense>
      </S.ResultsContainer>
    </S.Container>
  );
}
