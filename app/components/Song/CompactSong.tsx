import { useNavigate } from "react-router";

import useFetchingSongStore from "~/contexts/useFetchingSongStore";

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
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const handleClick = () => {
    setFetchingSong({
      fetchType: "get",
      id,
      initialData: { id, title, coverUrl },
    });
    navigate(`/player`);
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
