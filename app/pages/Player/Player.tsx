import { useEffect } from "react";

import LyricsParagraph from "~/components/LyricsParagraph";
import SongOverview from "~/components/SongOverview";
import { useAppBarStore } from "~/contexts/useAppBarStore";

import type { Route } from "./+types/Player";
import * as S from "./Player.styles";

export default function Player({ params }: Route.LoaderArgs) {
  const { setVariant, setSongTitle } = useAppBarStore();

  useEffect(() => {
    setVariant("player");
    setSongTitle("Song Title");
  }, []);

  return (
    <S.Container>
      <SongOverview
        title={"Song Title"}
        artist={"Artist"}
        album={"Album"}
        createdAt={"2022-01-01"}
        coverUrl={"https://picsum.photos/200"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        }
      />

      <S.Lyrics>
        <LyricsParagraph
          isActive={true}
          summary={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          }
          onReport={() => console.log("Report")}
        >
          lyrics
        </LyricsParagraph>
      </S.Lyrics>
    </S.Container>
  );
}
