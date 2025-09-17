import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

import usePlayingSongStore from "~/contexts/usePlayingSongStore";

import * as S from "./YouTubePlayer.styles";

export default function YouTubePlayer() {
  const { song, setIsPlaying, playerRef, setTime } = usePlayingSongStore();

  const setPlayerRef = useCallback((ref: HTMLVideoElement) => {
    if (!ref) return;
    playerRef.current = ref;
  }, []);

  useEffect(() => {
    setTime(0);
  }, [song]);

  const handleTimeUpdate = useCallback(() => {
    if (!playerRef.current) return;
    setTime(playerRef.current.currentTime);
  }, [setTime, playerRef]);

  return (
    song &&
    song.sourceProvider === "YouTube" &&
    song.sourceId && (
      <S.Wrapper>
        <ReactPlayer
          ref={setPlayerRef}
          src={`https://www.youtube.com/watch?v=${song.sourceId}`}
          onTimeUpdate={handleTimeUpdate}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          onReady={() => playerRef.current?.play()}
        />
      </S.Wrapper>
    )
  );
}
