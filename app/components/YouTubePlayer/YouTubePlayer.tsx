import { useCallback, useRef } from "react";
import ReactPlayer from "react-player";

import usePlayerStore from "~/contexts/usePlayerStore";

import * as S from "./YouTubePlayer.styles";

export default function YouTubePlayer() {
  const { isPlaying, sourceProvider, sourceId, setTime } = usePlayerStore();
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  return (
    sourceProvider === "YouTube" &&
    sourceId && (
      <S.Wrapper>
        <ReactPlayer
          ref={setPlayerRef}
          src={`https://www.youtube.com/watch?v=${sourceId}`}
          playing={isPlaying}
          onTimeUpdate={() => setTime(playerRef.current?.currentTime || 0)}
        />
      </S.Wrapper>
    )
  );
}
