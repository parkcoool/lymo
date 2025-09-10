import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { MdPlayCircle } from "react-icons/md";

import { getDominantColorFromElement } from "~/utils/getDominantColorFromElement";

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
  const coverElementRef = useRef<HTMLImageElement>(null);

  // 커버 대표 색상
  const { data: coverColor } = useQuery({
    queryKey: ["coverColor", id],
    queryFn: async () => {
      if (coverElementRef.current == null) throw new Error();
      return await getDominantColorFromElement(coverElementRef.current);
    },
    initialData: "#ffffff",
  });

  const handlePlay = () => {
    // TODO: Implement song play functionality
  };

  return (
    <S.Wrapper $coverColor={coverColor} {...props}>
      <S.Info>
        <S.Cover
          crossOrigin="anonymous"
          src={coverUrl ?? ""}
          ref={coverElementRef}
        />
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
