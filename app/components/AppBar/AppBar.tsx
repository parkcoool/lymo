import { MdChevronLeft, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router";

import IconButton from "../IconButton";

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
  const navigate = useNavigate();

  const isBackButtonVisible = variant === "player" || variant === "search";
  const isSearchBoxVisible = variant === "home" || variant === "search";
  const isSongTitleVisible = variant === "player";
  const searchBoxText = variant === "search" ? searchQuery : "음악 검색";

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <S.Wrapper $gradient={variant === "player"}>
      <S.Left>
        {isBackButtonVisible && (
          <IconButton onClick={handleBackButtonClick}>
            <S.LeftIconWrapper>
              <MdChevronLeft />
            </S.LeftIconWrapper>
          </IconButton>
        )}
        {isSearchBoxVisible && <S.SearchBox>{searchBoxText}</S.SearchBox>}
        {isSongTitleVisible && <S.SongTitle>{songTitle}</S.SongTitle>}
      </S.Left>
      <S.Right>
        <IconButton>
          <S.PersonIconWrapper>
            <MdPerson />
          </S.PersonIconWrapper>
        </IconButton>
      </S.Right>
    </S.Wrapper>
  );
}
