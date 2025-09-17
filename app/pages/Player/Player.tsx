import { LayoutGroup } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";

import FooterPlayer from "~/components/FooterPlayer";
import LyricsParagraph from "~/components/LyricsParagraph";
import {
  LyricsSentence,
  LyricsSentenceSkeleton,
} from "~/components/LyricsSentence";
import SongOverview from "~/components/SongSummary";
import usePlayingSongStore from "~/contexts/usePlayingSongStore";
import useThemeStore from "~/contexts/useThemeStore";
import useCoverColor from "~/hooks/useCoverColor";
import darkenHexColor from "~/utils/darkenHexColor";

import * as S from "./Player.styles";

export default function Player() {
  const { setDynamicBackground, resetDynamicBackground } = useThemeStore();
  const { song, isPlaying, time, setTime, playerRef } = usePlayingSongStore();
  const theme = useTheme();

  // 커버 대표 색상
  const coverElementRef = useRef<HTMLImageElement>(null);
  const coverColor = useCoverColor(coverElementRef, song?.coverUrl ?? null);

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
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  // 문장 클릭 핸들러
  const handleSentenceClick = (start: number) => {
    if (!playerRef.current) return;
    playerRef.current.currentTime = start + 0.1;
    setTime(start + 0.1);
  };

  return (
    <S.Container>
      <LayoutGroup>
        <S.SongOverviewWrapper>
          <SongOverview
            title={song?.title}
            artist={song?.artist}
            album={song?.album}
            publishedAt={song?.publishedAt}
            coverUrl={song?.coverUrl}
            summary={song?.summary}
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
          title={song?.title}
          artist={song?.artist}
          coverUrl={song?.coverUrl}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      </S.Footer>
    </S.Container>
  );
}
