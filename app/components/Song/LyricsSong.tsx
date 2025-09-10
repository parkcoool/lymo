import { useMemo } from "react";
import { MdPlayCircle } from "react-icons/md";

import * as S from "./LyricsSong.styles";

interface LyricsSongProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  lyrics: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function LyricsSong({
  id,
  title,
  artist,
  coverUrl,
  lyrics,
  ...props
}: LyricsSongProps) {
  // TODO: Replace with actual dominant color extraction
  const coverColor = useMemo(() => "#ffffff", [coverUrl]);

  const handlePlay = () => {
    // TODO: Implement song play functionality
  };

  return (
    <S.Wrapper $coverColor={coverColor} {...props}>
      <S.Info>
        <S.Cover src={coverUrl ?? ""} />
        <S.InfoText>
          <S.Title>{title}</S.Title>
          <S.Artist>{artist}</S.Artist>
        </S.InfoText>
      </S.Info>
      <S.Lyrics>
        <S.SeteneceContainer>
          {lyrics
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => (
              <li key={line}>
                <p>{line}</p>
              </li>
            ))}
        </S.SeteneceContainer>
      </S.Lyrics>
      <S.Footer>
        <S.PlayCircleIconWrapper>
          <MdPlayCircle />
        </S.PlayCircleIconWrapper>
      </S.Footer>
    </S.Wrapper>
  );
}
