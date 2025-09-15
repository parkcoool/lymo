import { LayoutGroup } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useTheme } from "styled-components";

import FooterPlayer from "~/components/FooterPlayer";
import LyricsParagraph from "~/components/LyricsParagraph";
import {
  LyricsSentence,
  LyricsSentenceSkeleton,
} from "~/components/LyricsSentence";
import SongOverview from "~/components/SongOverview";
import usePlayerStore from "~/contexts/usePlayerStore";
import useThemeStore from "~/contexts/useThemeStore";
import useCoverColor from "~/hooks/useCoverColor";
import usePlaySongEffect from "~/hooks/usePlaySongEffect";
import darkenHexColor from "~/utils/darkenHexColor";

import type { Route } from "./+types/Player";
import * as S from "./Player.styles";

interface BonusData {
  title: string;
  artist?: string;
  duration?: number;
  coverUrl: string;
}

export default function Player({ params }: Route.LoaderArgs) {
  const songId = params.songId;

  const { setDynamicBackground, resetDynamicBackground } = useThemeStore();
  const { isPlaying, time, setTime, player } = usePlayerStore();
  const theme = useTheme();

  // state로 전달된 보너스 데이터
  const location = useLocation();
  const bonusData = location.state as BonusData | undefined;

  // 노래 데이터 로드 및 플레이어 상태에 반영
  const song = usePlaySongEffect(songId);

  // 커버 대표 색상
  const coverElementRef = useRef<HTMLImageElement>(null);
  const coverColor = useCoverColor(coverElementRef, songId);

  // 커버 색상에 따라 배경색 변경
  useEffect(() => {
    if (coverColor) setDynamicBackground(darkenHexColor(coverColor, 70));
    return () => resetDynamicBackground();
  }, [coverColor]);

  // 배경색
  const backgroundColor = useMemo(
    () =>
      coverColor ? darkenHexColor(coverColor, 80) : theme.colors.background,
    [coverColor, theme.colors.background]
  );

  // 재생/일시정지 핸들러
  const handlePlayPause = () => {
    if (!player.current) return;
    if (isPlaying) {
      player.current.pause();
    } else {
      player.current.play();
    }
  };

  // 문장 클릭 핸들러
  const handleSentenceClick = (start: number) => {
    if (!player.current) return;
    player.current.currentTime = start + 0.1;
    setTime(start + 0.1);
  };

  return (
    <S.Container>
      <LayoutGroup>
        <S.SongOverviewWrapper>
          <SongOverview
            title={song?.title ?? bonusData?.title}
            artist={song?.artist ?? bonusData?.artist}
            album={song?.album}
            createdAt={song?.publishedAt}
            coverUrl={song?.coverUrl ?? bonusData?.coverUrl}
            description={song?.overview}
            coverElementRef={coverElementRef}
          />
        </S.SongOverviewWrapper>

        <S.Lyrics>
          {song?.lyrics !== undefined ? (
            song?.lyrics.map((paragraph, paragraphIndex) => (
              <LyricsParagraph
                key={paragraphIndex}
                summary={paragraph.summary ?? undefined}
                isActive={
                  time >= paragraph.sentences[0].start &&
                  time <=
                    paragraph.sentences[paragraph.sentences.length - 1].end
                }
              >
                {paragraph.sentences.map((sentence, sentenceIndex) => (
                  <LyricsSentence
                    key={sentenceIndex}
                    sentence={sentence.text}
                    translation={sentence.translation}
                    isActive={time >= sentence.start && time <= sentence.end}
                    onClick={() => handleSentenceClick(sentence.start)}
                  />
                ))}
              </LyricsParagraph>
            ))
          ) : (
            <LyricsSentenceSkeleton />
          )}
        </S.Lyrics>
      </LayoutGroup>

      <S.Footer
        $backgroundColor={backgroundColor}
        style={
          {
            "--progress": `${(1 - time / (song?.duration ?? 1)) * 100}%`,
          } as React.CSSProperties
        }
      >
        <FooterPlayer
          title={song?.title ?? bonusData?.title}
          artist={song?.artist ?? bonusData?.artist}
          coverUrl={song?.coverUrl ?? bonusData?.coverUrl}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      </S.Footer>
    </S.Container>
  );
}
