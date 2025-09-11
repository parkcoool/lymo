import { useMemo } from "react";
import { Outlet, useLocation } from "react-router";

import AppBar from "~/components/AppBar";
import { useAppBarStore } from "~/contexts/useAppBarStore";
import type { AppBarVariant } from "~/types/appBar";

const AppBarVariants: Record<string, AppBarVariant> = {
  "": "home",
  player: "player",
  search: "search",
};

export default function MainLayout() {
  const pathname = useLocation().pathname.split("/")[1];
  const { overrideVariant, searchQuery, songTitle } = useAppBarStore();

  const baseVariant = useMemo(
    () => AppBarVariants[pathname] ?? "none",
    [pathname]
  );

  return (
    <>
      <AppBar
        variant={overrideVariant ?? baseVariant}
        searchQuery={searchQuery}
        songTitle={songTitle}
      />
      <Outlet />
    </>
  );
}
