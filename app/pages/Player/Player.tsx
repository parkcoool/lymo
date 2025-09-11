import { useEffect } from "react";

import { useAppBarStore } from "~/contexts/useAppBarStore";

import type { Route } from "./+types/Player";
import * as S from "./Player.styles";

export default function Player({ params }: Route.LoaderArgs) {
  const { setVariant, setSongTitle } = useAppBarStore();

  useEffect(() => {
    setVariant("player");
    setSongTitle("Song Title");
  }, []);

  return <S.Container>{params.songId}</S.Container>;
}
