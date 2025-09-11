import { MdChevronLeft, MdPerson } from "react-icons/md";

import * as S from "./AppBar.styles";

interface AppBarProps {
  variant: "none" | "home" | "player" | "search";
  searchQuery?: string;
  songTitle?: string;
}

export default function AppBar({
  variant,
  searchQuery,
  songTitle,
}: AppBarProps) {
  const isBackButtonVisible = variant === "player" || variant === "search";
  const isSearchBoxVisible = variant === "home" || variant === "search";
  const isSongTitleVisible = variant === "player";
  const searchBoxText = variant === "search" ? searchQuery : "음악 검색";

  return (
    <S.Wrapper $gradient={variant === "player"}>
      <S.Left>
        {isBackButtonVisible && (
          <S.LeftIconWrapper>
            <MdChevronLeft />
          </S.LeftIconWrapper>
        )}
        {isSearchBoxVisible && <S.SearchBox>{searchBoxText}</S.SearchBox>}
        {isSongTitleVisible && <S.SongTitle>{songTitle}</S.SongTitle>}
      </S.Left>
      <S.Right>
        <S.PersonIconWrapper>
          <MdPerson />
        </S.PersonIconWrapper>
      </S.Right>
    </S.Wrapper>
  );
}
