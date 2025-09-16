import { useMemo } from "react";
import { Outlet, useLocation } from "react-router";

import AppBar from "~/components/AppBar";
import YouTubePlayer from "~/components/YouTubePlayer/YouTubePlayer";
import type { AppBarVariant } from "~/types/appBar";

const AppBarVariants: Map<string, AppBarVariant> = new Map([
  ["", "home"],
  ["player", "player"],
  ["search", "search"],
]);

export default function MainLayout() {
  const pathnames = useLocation().pathname.split("/");

  const searchQuery = useMemo(
    () =>
      pathnames[1] === "search" ? decodeURIComponent(pathnames[2]) : undefined,
    [pathnames]
  );

  const variant = useMemo(
    () => AppBarVariants.get(pathnames[1]) ?? "home",
    [pathnames]
  );

  return (
    <>
      <AppBar variant={variant} searchQuery={searchQuery} />
      <Outlet />
      <YouTubePlayer />
    </>
  );
}
