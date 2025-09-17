import { Outlet, useNavigate } from "react-router";

import MiniPlayer from "~/components/Miniplayer/MiniPlayer";
import usePlayingSongStore from "~/contexts/usePlayingSongStore";

import * as S from "./MiniPlayerLayout.styles";

export default function MiniPlayerLayout() {
  const { isPlaying, song, playerRef } = usePlayingSongStore();
  const navigate = useNavigate();

  const handlePlayerExpand = () => {
    navigate("/player");
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  return (
    <>
      <Outlet />

      {/* 미니 플레이어 */}
      {song && (
        <S.MiniPlayerWrapper>
          <MiniPlayer
            coverUrl={song.coverUrl}
            title={song.title}
            artist={song.artist}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onExpand={handlePlayerExpand}
          />
        </S.MiniPlayerWrapper>
      )}
    </>
  );
}
