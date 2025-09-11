import { useMemo } from "react";
import { Outlet, useLocation } from "react-router";

import AppBar from "~/components/AppBar";
import { useAppBarStore } from "~/contexts/useAppBarStore";
import usePlayerStore from "~/contexts/usePlayerStore";
import type { AppBarVariant } from "~/types/appBar";

const AppBarVariants: Map<string, AppBarVariant> = new Map([
  ["", "home"],
  ["player", "player"],
  ["search", "search"],
]);

export default function MainLayout() {
  const pathname = useLocation().pathname.split("/")[1];
  const { overrideVariant, searchQuery } = useAppBarStore();
  const { song } = usePlayerStore();

  const baseVariant = useMemo(
    () => AppBarVariants.get(pathname) ?? "none",
    [pathname]
  );

  return (
    <>
      <AppBar
        variant={overrideVariant ?? baseVariant}
        searchQuery={searchQuery}
        songTitle={song?.title ?? ""}
      />
      <Outlet />
    </>
  );
}
