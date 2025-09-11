import { AnimatePresence, motion } from "motion/react";
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
        <AnimatePresence initial={false} mode="wait">
          {/* 뒤로 가기 버튼 */}
          {isBackButtonVisible && (
            <motion.div
              key="back-button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <IconButton onClick={handleBackButtonClick}>
                <S.LeftIconWrapper>
                  <MdChevronLeft />
                </S.LeftIconWrapper>
              </IconButton>
            </motion.div>
          )}

          {/* 검색창 */}
          {isSearchBoxVisible && (
            <S.SearchBox
              key="search-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {searchBoxText}
            </S.SearchBox>
          )}

          {/* 노래 제목 */}
          {isSongTitleVisible && (
            <S.SongTitle
              key="song-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {songTitle}
            </S.SongTitle>
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
