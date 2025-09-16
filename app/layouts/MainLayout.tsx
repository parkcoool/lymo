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
  const pathname = useLocation().pathname.split("/")[1];
  const searchQuery =
    pathname === "search"
      ? decodeURIComponent(useLocation().pathname.split("/")[2])
      : undefined;

  const variant = useMemo(
    () => AppBarVariants.get(pathname) ?? "home",
    [pathname]
  );

  return (
    <>
      <AppBar variant={variant} searchQuery={searchQuery} />
      <Outlet />
      <YouTubePlayer />
    </>
  );
}
