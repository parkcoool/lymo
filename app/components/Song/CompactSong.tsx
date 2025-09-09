import * as S from "./CompactSong.styles";

interface CompactSongProps {
  id: string;
  title: string;
  coverUrl: string | null;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export default function CompactSong({
  id,
  title,
  coverUrl,
  ...props
}: CompactSongProps) {
  const handleClick = () => {
    // TODO: Implement song click functionality
  };

  return (
    <S.Wrapper
      coverUrl={coverUrl ?? ""}
      aria-label={title}
      title={title}
      onClick={handleClick}
      {...props}
    >
      <S.TitleWrapper>
        <S.Title>{title}</S.Title>
      </S.TitleWrapper>
    </S.Wrapper>
  );
}
