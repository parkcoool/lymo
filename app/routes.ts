import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [
    layout("./layouts/MiniPlayerLayout.tsx", [
      index("./pages/Home/Home.tsx"),
      route("/search/:query", "./pages/Search/SearchResult.tsx"),
    ]),
    route("/player/:songId", "./pages/Player/Player.tsx"),
  ]),

  route("/search", "./pages/Search/Search.tsx"),
] satisfies RouteConfig;
