import { Outlet } from "react-router";

import AppBar from "~/components/AppBar/AppBar";

export default function MainLayout() {
  return (
    <>
      <AppBar variant={"none"} />
      <Outlet />
    </>
  );
}
