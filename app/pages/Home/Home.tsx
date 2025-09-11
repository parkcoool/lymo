import { Suspense } from "react";
import { MdLyrics, MdTrendingUp } from "react-icons/md";
import { useNavigate } from "react-router";

import LogoIcon from "~/assets/logo.svg?react";
import MiniPlayer from "~/components/Miniplayer";
import {
  PopularSongList,
  PopularSongListSkeleton,
} from "~/components/PopularSongList";
import { LyricsSong } from "~/components/Song";
import usePlayerStore from "~/contexts/usePlayerStore";
import useHomePageAppBarEffect from "~/hooks/useHomePageAppBarEffect";

import * as S from "./Home.styles";

export default function Home() {
  const navigate = useNavigate();
  const { isPlaying, song, playPause } = usePlayerStore();
  useHomePageAppBarEffect();

  const handlePlayerExpand = () => {
    if (song) navigate(`/player/${song.id}`);
  };

  return (
    <S.Container>
      {/* 검색 섹션 */}
      <S.SearchSection>
        <S.Brand>
          <S.LogoIconWrapper>
            <LogoIcon />
          </S.LogoIconWrapper>
          Lymo
        </S.Brand>
        <S.SearchBox>음악 검색</S.SearchBox>
      </S.SearchSection>

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
          <LyricsSong
            id={"1"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
          <LyricsSong
            id={"2"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200/orange/white"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
          <LyricsSong
            id={"3"}
            title={"song title"}
            artist={"artist name"}
            coverUrl={"https://placehold.co/200x200"}
            lyrics={`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry`}
          />
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
