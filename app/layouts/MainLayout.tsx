import { Outlet } from "react-router";

import AppBar from "~/components/AppBar";
import { useAppBarStore } from "~/contexts/useAppBarStore";

export default function MainLayout() {
  const { variant, searchQuery, songTitle } = useAppBarStore();

  return (
    <>
      <AppBar
        variant={variant}
        searchQuery={searchQuery}
        songTitle={songTitle}
      />
      <Outlet />
    </>
  );
}
