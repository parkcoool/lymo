import { AnimatePresence } from "motion/react";
import { MdChevronLeft, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router";

import useSearchBoxVisible from "~/hooks/useSearchBoxVisible";

import IconButton from "../IconButton";

import * as S from "./AppBar.styles";

interface AppBarProps {
  variant: "home" | "player" | "search";
  searchQuery?: string;
}

export default function AppBar({ variant, searchQuery }: AppBarProps) {
  const navigate = useNavigate();

  const isSearchBoxVisibleInHome = useSearchBoxVisible();

  const isBackButtonVisible = variant === "player" || variant === "search";
  const isSearchBoxVisible =
    variant === "search" || (variant === "home" && !isSearchBoxVisibleInHome);
  const searchBoxText = variant === "search" ? searchQuery : "음악 검색";

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleSearchBoxClick = () => {
    navigate("/search");
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
        <AnimatePresence initial={false}>
          {isSearchBoxVisible && (
            <S.SearchBox
              onClick={handleSearchBoxClick}
              key="search-box"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: "0%" }}
              exit={{ opacity: 0, y: "-100%" }}
            >
              {searchBoxText}
            </S.SearchBox>
          )}
        </AnimatePresence>
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
