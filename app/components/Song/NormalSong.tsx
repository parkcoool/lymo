import * as S from "./NormalSong.styles";

interface NormalSongProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
}

export default function NormalSong({
  id,
  title,
  artist,
  coverUrl,
}: NormalSongProps) {
  const handleClick = () => {
    // TODO: Implement song click functionality
  };

  return (
    <S.Wrapper aria-label={title} title={title} onClick={handleClick}>
      <S.Cover coverUrl={coverUrl ?? ""} />
      <S.Right>
        <S.Title>{title}</S.Title>
        <S.Artist>{artist}</S.Artist>
      </S.Right>
    </S.Wrapper>
  );
}
