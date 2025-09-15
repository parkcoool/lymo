import { useCallback } from "react";
import ReactPlayer from "react-player";

import usePlayerStore from "~/contexts/usePlayerStore";

import * as S from "./YouTubePlayer.styles";

export default function YouTubePlayer() {
  const { setIsPlaying, player, sourceProvider, sourceId, setTime } =
    usePlayerStore();

  const setPlayerRef = useCallback((ref: HTMLVideoElement) => {
    if (!ref) return;
    player.current = ref;
  }, []);

  return (
    sourceProvider === "YouTube" &&
    sourceId && (
      <S.Wrapper>
        <ReactPlayer
          ref={setPlayerRef}
          src={`https://www.youtube.com/watch?v=${sourceId}`}
          onTimeUpdate={() => setTime(player.current?.currentTime || 0)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          onReady={() => player.current?.play()}
        />
      </S.Wrapper>
    )
  );
}
