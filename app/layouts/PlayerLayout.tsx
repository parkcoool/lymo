import { Outlet } from "react-router";

import YouTubePlayer from "~/components/YouTubePlayer/YouTubePlayer";

export default function PlayerLayout() {
  return (
    <>
      <Outlet />
      <YouTubePlayer />
    </>
  );
}
