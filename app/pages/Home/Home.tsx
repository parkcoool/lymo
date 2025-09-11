import { Suspense, useRef } from "react";
import { MdLyrics, MdTrendingUp } from "react-icons/md";
import { useNavigate } from "react-router";

import LogoIcon from "~/assets/logo.svg?react";
import {
  LyricalSongList,
  LyricalSongListSkeleton,
} from "~/components/LyricalSongList";
import MiniPlayer from "~/components/Miniplayer";
import {
  PopularSongList,
  PopularSongListSkeleton,
} from "~/components/PopularSongList";
import usePlayerStore from "~/contexts/usePlayerStore";
import useHomePageSearchBoxWidth from "~/hooks/useHomePageSearchBoxWidth";

import * as S from "./Home.styles";

export default function Home() {
  const { isPlaying, song, playPause } = usePlayerStore();
  const searchBoxWidth = useHomePageSearchBoxWidth();
  const navigate = useNavigate();

  const handlePlayerExpand = () => {
    if (song) navigate(`/player/${song.id}`);
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
        <S.SearchBox $width={`${searchBoxWidth}%`}>음악 검색</S.SearchBox>
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

      {/* 미니 플레이어 */}
      {song && (
        <S.MiniPlayerWrapper>
          <MiniPlayer
            id={song.id}
            coverUrl={song.coverUrl}
            title={song.title}
            artist={song.artist}
            isPlaying={isPlaying}
            onPlayPause={playPause}
            onExpand={handlePlayerExpand}
          />
        </S.MiniPlayerWrapper>
      )}
    </S.Container>
  );
}
