import { useNavigate } from "react-router";

import useFetchingSongStore from "~/contexts/useFetchingSongStore";

import * as S from "./NormalSong.styles";

interface NormalSongProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export default function NormalSong({
  id,
  title,
  artist,
  coverUrl,
  ...props
}: NormalSongProps) {
  const navigate = useNavigate();
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const handleClick = () => {
    setFetchingSong({
      fetchType: "get",
      id,
      initialData: { id, title, artist, coverUrl },
    });
    navigate(`/player`);
  };

  return (
    <S.Wrapper
      aria-label={title}
      title={title}
      onClick={handleClick}
      {...props}
    >
      <S.Cover src={coverUrl ?? ""} />
      <S.Right>
        <S.Title>{title}</S.Title>
        <S.Artist>{artist}</S.Artist>
      </S.Right>
    </S.Wrapper>
  );
}
