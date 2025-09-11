import { MdChevronLeft, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router";

import IconButton from "../IconButton";

import * as S from "./AppBar.styles";

interface AppBarProps {
  variant: "home" | "player" | "search";
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
  const isSearchBoxVisible = variant === "search";
  const isSongTitleVisible = variant === "player";
  const searchBoxText = variant === "search" ? searchQuery : "음악 검색";

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <S.Wrapper>
      <S.Left>
        {/* 뒤로 가기 버튼 */}
        {isBackButtonVisible && (
          <IconButton onClick={handleBackButtonClick}>
            <S.LeftIconWrapper>
              <MdChevronLeft />
            </S.LeftIconWrapper>
          </IconButton>
        )}

        {/* 검색창 */}
        {isSearchBoxVisible && <S.SearchBox>{searchBoxText}</S.SearchBox>}

        {/* 노래 제목 */}
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
