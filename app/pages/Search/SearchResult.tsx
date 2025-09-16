import { Suspense, useState } from "react";

import AddSongModal from "~/components/AddSongModal/AddSongModal";
import SearchResultHeader from "~/components/SearchResultHeader";
import {
  SearchResultList,
  SearchResultListSkeleton,
} from "~/components/SearchResultList";

import type { Route } from "./+types/SearchResult";
import * as S from "./SearchResult.styles";

export default function SearchResult({ params }: Route.LoaderArgs) {
  const query = params.query;
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

  const handleOpenAddSongModal = () => {
    setIsAddSongModalOpen(true);
  };

  const handleCloseAddSongModal = () => {
    setIsAddSongModalOpen(false);
  };

  return (
    <S.Container>
      <Suspense>
        <SearchResultHeader query={query} />
      </Suspense>

      <S.ResultsContainer>
        <Suspense fallback={<SearchResultListSkeleton />}>
          <SearchResultList
            query={query}
            onOpenAddSongModal={handleOpenAddSongModal}
          />
        </Suspense>
      </S.ResultsContainer>

      <AddSongModal
        isOpen={isAddSongModalOpen}
        onClose={handleCloseAddSongModal}
      />
    </S.Container>
  );
}
