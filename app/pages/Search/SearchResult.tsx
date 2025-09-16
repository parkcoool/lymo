import { Suspense } from "react";

import SearchResultHeader from "~/components/SearchResultHeader/SearchResultHeader";
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
      <Suspense>
        <SearchResultHeader query={query} />
      </Suspense>

      <S.ResultsContainer>
        <Suspense fallback={<SearchResultListSkeleton />}>
          <SearchResultList query={query} />
        </Suspense>
      </S.ResultsContainer>
    </S.Container>
  );
}
