import ReactPlayer from "react-player";

import usePlayerStore from "~/contexts/usePlayerStore";

import * as S from "./YouTubePlayer.styles";

export default function YouTubePlayer() {
  const { isPlaying, sourceProvider, sourceId, setTime } = usePlayerStore();

  return (
    sourceProvider === "YouTube" &&
    sourceId && (
      <S.Wrapper>
        <ReactPlayer
          src={`https://www.youtube.com/watch?v=${sourceId}`}
          playing={isPlaying}
          onTimeUpdate={(e) => setTime(e.timeStamp / 1000)}
        />
      </S.Wrapper>
    )
  );
}
