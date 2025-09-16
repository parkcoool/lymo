import { Suspense } from "react";
import { MdLyrics, MdTrendingUp } from "react-icons/md";
import { useNavigate } from "react-router";

import LogoIcon from "~/assets/logo.svg?react";
import {
  LyricalSongList,
  LyricalSongListSkeleton,
} from "~/components/LyricalSongList";
import {
  PopularSongList,
  PopularSongListSkeleton,
} from "~/components/PopularSongList";

import * as S from "./Home.styles";

export default function Home() {
  const navigate = useNavigate();

  const handleSearchBoxClick = () => {
    navigate("/search");
  };

  return (
    <S.Container>
      {/* 최상단 섹션 */}
      <S.HeroSection>
        <S.Brand>
          <S.LogoIconWrapper>
            <LogoIcon />
          </S.LogoIconWrapper>
          Lymo
        </S.Brand>
      </S.HeroSection>

      {/* 검색 박스 */}
      <S.SearchBoxWrapper>
        <S.SearchBox onClick={handleSearchBoxClick}>음악 검색</S.SearchBox>
      </S.SearchBoxWrapper>

      {/* 인기 섹션 */}
      <S.Section>
        <S.SectionTitle>
          <S.SectionIconWrapper>
            <MdTrendingUp />
          </S.SectionIconWrapper>
          인기
        </S.SectionTitle>
        <S.SectionContent>
          <Suspense fallback={<PopularSongListSkeleton />}>
            <PopularSongList />
          </Suspense>
        </S.SectionContent>
      </S.Section>

      {/* 가사가 좋은 음악 섹션 */}
      <S.Section>
        <S.SectionTitle>
          <S.SectionIconWrapper>
            <MdLyrics />
          </S.SectionIconWrapper>
          가사가 좋은 음악
        </S.SectionTitle>
        <S.SectionContent>
          <Suspense fallback={<LyricalSongListSkeleton />}>
            <LyricalSongList />
          </Suspense>
        </S.SectionContent>
      </S.Section>
    </S.Container>
  );
}
