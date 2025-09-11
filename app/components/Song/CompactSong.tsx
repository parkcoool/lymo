import { useNavigate } from "react-router";

import * as S from "./CompactSong.styles";

interface CompactSongProps {
  id: string;
  title: string;
  coverUrl: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export default function CompactSong({
  id,
  title,
  coverUrl,
  ...props
}: CompactSongProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/player/${id}`, { state: { title, coverUrl } });
  };

  return (
    <S.Wrapper
      $coverUrl={coverUrl ?? ""}
      aria-label={`${title} 재생하기`}
      title={`${title} 재생하기`}
      onClick={handleClick}
      {...props}
    >
      <S.TitleWrapper>
        <S.Title>{title}</S.Title>
      </S.TitleWrapper>
    </S.Wrapper>
  );
}
