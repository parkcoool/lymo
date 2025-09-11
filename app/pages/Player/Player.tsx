import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";

import FooterPlayer from "~/components/FooterPlayer";
import LyricsParagraph from "~/components/LyricsParagraph";
import LyricsSentence from "~/components/LyricsSentence";
import SongOverview from "~/components/SongOverview";
import usePlayerStore from "~/contexts/usePlayerStore";
import useThemeStore from "~/contexts/useThemeStore";
import useCoverColor from "~/hooks/useCoverColor";
import darkenHexColor from "~/utils/darkenHexColor";

import type { Route } from "./+types/Player";
import * as S from "./Player.styles";

export default function Player({ params }: Route.LoaderArgs) {
  const { setDynamicBackground, resetDynamicBackground } = useThemeStore();
  const { setSong, isPlaying, playPause } = usePlayerStore();
  const theme = useTheme();

  // 커버 대표 색상
  const coverElementRef = useRef<HTMLImageElement>(null);
  const coverColor = useCoverColor(coverElementRef, params.songId);

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

  // 현재 재생 중인 노래 변경
  useEffect(() => {
    setSong({
      id: params.songId,
      title: "Song Title",
      artist: "Artist",
      duration: 240,
      coverUrl: "https://picsum.photos/200",
    });
  }, []);

  return (
    <S.Container>
      <SongOverview
        title={"Song Title"}
        artist={"Artist"}
        album={"Album"}
        createdAt={"2022-01-01"}
        coverUrl={"https://picsum.photos/200"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        }
        coverElementRef={coverElementRef}
      />

      <S.Lyrics>
        <LyricsParagraph
          isActive
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          }
          onReport={() => console.log("Report")}
        >
          <LyricsSentence
            isActive
            sentence="Hey Jude"
            translation="헤이 주드"
          />
          <LyricsSentence
            sentence="Don't make it bad"
            translation="나쁘게 만들지 마"
          />
          <LyricsSentence
            sentence="Take a sad song and make it better"
            translation="슬픈 노래를 가져다가 더 좋게 만들어"
          />
          <LyricsSentence
            sentence="Remember to let her into your heart"
            translation="그녀를 네 마음에 들이도록 기억해"
          />
          <LyricsSentence
            sentence="Then you can start to make it better"
            translation="그러면 더 좋게 만들 수 있어"
          />
        </LyricsParagraph>
      </S.Lyrics>

      <S.Footer $backgroundColor={backgroundColor} $percentage={30}>
        <FooterPlayer
          coverUrl={"https://picsum.photos/200"}
          title={"Song Title"}
          artist={"Artist"}
          isPlaying={isPlaying}
          onPlayPause={playPause}
        />
      </S.Footer>
    </S.Container>
  );
}
