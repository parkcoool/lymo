import * as S from "./CompactSong.styles";

interface CompactSongProps {
  id: string;
  title: string;
  coverUrl: string | null;
}

export default function CompactSong({ id, title, coverUrl }: CompactSongProps) {
  const handleClick = () => {
    // TODO: Implement song click functionality
  };

  return (
    <S.Wrapper
      coverUrl={coverUrl ?? ""}
      aria-label={title}
      title={title}
      onClick={handleClick}
    >
      <S.TitleWrapper>
        <S.Title>{title}</S.Title>
      </S.TitleWrapper>
    </S.Wrapper>
  );
}
