import { Outlet, useNavigate } from "react-router";

import MiniPlayer from "~/components/Miniplayer/MiniPlayer";
import usePlayerStore from "~/contexts/usePlayerStore";

import * as S from "./MiniPlayerLayout.styles";

export default function MiniPlayerLayout() {
  const { isPlaying, song, player } = usePlayerStore();
  const navigate = useNavigate();

  const handlePlayerExpand = () => {
    if (song) navigate(`/player/${song.id}`);
  };

  const handlePlayPause = () => {
    if (!player.current) return;
    if (isPlaying) {
      player.current.pause();
    } else {
      player.current.play();
    }
  };

  return (
    <>
      <Outlet />

      {/* 미니 플레이어 */}
      {song && (
        <S.MiniPlayerWrapper>
          <MiniPlayer
            id={song.id}
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
