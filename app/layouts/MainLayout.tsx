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
  const { searchQuery } = useAppBarStore();
  const { song } = usePlayerStore();

  const variant = useMemo(
    () => AppBarVariants.get(pathname) ?? "home",
    [pathname]
  );

  return (
    <>
      <AppBar
        variant={variant}
        searchQuery={searchQuery}
        songTitle={song?.title ?? ""}
      />
      <Outlet />
    </>
  );
}
