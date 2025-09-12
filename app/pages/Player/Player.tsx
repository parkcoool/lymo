import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useTheme } from "styled-components";

import getLyrics from "~/apis/getLyrics";
import getSongOverview from "~/apis/getSongOverview";
import FooterPlayer from "~/components/FooterPlayer";
import LyricsParagraph from "~/components/LyricsParagraph";
import {
  LyricsSentence,
  LyricsSetenceSkeleton,
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
  const { isPlaying, playPause } = usePlayerStore();
  const theme = useTheme();

  // state로 전달된 보너스 데이터
  const location = useLocation();
  const bonusData = location.state as BonusData | undefined;

  // 노래 데이터 로드 및 플레이어 상태에 반영
  const song = usePlaySongEffect(songId);
  const { data: overview } = useQuery({
    queryKey: ["songOverview", songId],
    queryFn: () => getSongOverview({ songId }),
    select: (data) => data.data.overview,
  });

  // 가사 데이터 로드
  const { data: lyrics } = useQuery({
    queryKey: ["lyrics", song?.lyricsId],
    queryFn: () =>
      song
        ? getLyrics({
            lyricsProvider: song?.lyricsProvider,
            lyricsId: song?.lyricsId,
          })
        : null,
    select: (data) => data?.data.lyrics,
    enabled: song !== undefined,
  });

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

  return (
    <S.Container>
      <LayoutGroup>
        <SongOverview
          title={song?.title ?? bonusData?.title}
          artist={song?.artist ?? bonusData?.artist}
          album={song?.album}
          createdAt={song?.createdAt}
          coverUrl={song?.coverUrl ?? bonusData?.coverUrl}
          description={overview}
          coverElementRef={coverElementRef}
        />

        <S.Lyrics>
          {lyrics !== undefined ? (
            lyrics?.map((paragraph, paragraphIndex) => (
              <LyricsParagraph key={paragraphIndex}>
                {paragraph.sentences.map((sentence, sentenceIndex) => (
                  <LyricsSentence
                    key={sentenceIndex}
                    sentence={sentence.text}
                    translation={sentence.translation}
                  />
                ))}
              </LyricsParagraph>
            ))
          ) : (
            <LyricsSetenceSkeleton />
          )}
        </S.Lyrics>
      </LayoutGroup>

      <S.Footer $backgroundColor={backgroundColor} $percentage={30}>
        <FooterPlayer
          title={song?.title ?? bonusData?.title}
          artist={song?.artist ?? bonusData?.artist}
          coverUrl={song?.coverUrl ?? bonusData?.coverUrl}
          isPlaying={isPlaying}
          onPlayPause={playPause}
        />
      </S.Footer>
    </S.Container>
  );
}
