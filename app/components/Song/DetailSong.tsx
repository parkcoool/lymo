import { MdPlayCircle } from "react-icons/md";
import { useNavigate } from "react-router";

import convertSecondsToString from "~/utils/convertSecondsToString";

import * as S from "./DetailSong.styles";

interface DetailSongProps {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string | null;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export default function NormalSong({
  id,
  title,
  artist,
  duration,
  coverUrl,
  ...props
}: DetailSongProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/player/${id}`);
  };

  return (
    <S.Wrapper
      aria-label={title}
      title={title}
      onClick={handleClick}
      {...props}
    >
      <S.Left>
        <S.Cover src={coverUrl ?? ""} />
        <S.Info>
          <S.Title>{title}</S.Title>
          <S.Description>{`${artist} ㆍ ${convertSecondsToString(duration)}`}</S.Description>
        </S.Info>
      </S.Left>
      <S.PlayCircleIconWrapper>
        <MdPlayCircle />
      </S.PlayCircleIconWrapper>
    </S.Wrapper>
  );
}
