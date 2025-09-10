import { MdChevronLeft, MdPerson } from "react-icons/md";

import * as S from "./AppBar.styles";

type AppBarProps =
  | {
      variant: "none" | "home";
    }
  | {
      variant: "player";
      songTitle: string;
    }
  | {
      variant: "search";
      searchQuery: string;
    };

export default function AppBar(props: AppBarProps) {
  const isBackButtonVisible =
    props.variant === "player" || props.variant === "search";
  const isSearchBoxVisible =
    props.variant === "home" || props.variant === "search";
  const isSongTitleVisible = props.variant === "player";
  const searchBoxText =
    props.variant === "search" ? props.searchQuery : "음악 검색";

  return (
    <S.Wrapper $gradient={props.variant === "player"}>
      <S.Left>
        {isBackButtonVisible && (
          <S.LeftIconWrapper>
            <MdChevronLeft />
          </S.LeftIconWrapper>
        )}
        {isSearchBoxVisible && <S.SearchBox>{searchBoxText}</S.SearchBox>}
        {isSongTitleVisible && <S.SongTitle>{props.songTitle}</S.SongTitle>}
      </S.Left>
      <S.Right>
        <S.PersonIconWrapper>
          <MdPerson />
        </S.PersonIconWrapper>
      </S.Right>
    </S.Wrapper>
  );
}
