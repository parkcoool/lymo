import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [
    index("./pages/Home/Home.tsx"),
    route("/player/:songId", "./pages/Player/Player.tsx"),
  ]),
] satisfies RouteConfig;
