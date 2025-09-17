import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/PlayerLayout.tsx", [
    layout("./layouts/AppBarLayout.tsx", [
      layout("./layouts/MiniPlayerLayout.tsx", [
        index("./pages/Home/Home.tsx"),
        route("/search/:query", "./pages/Search/SearchResult.tsx"),
      ]),
      route("/player", "./pages/Player/Player.tsx"),
    ]),
    route("/search", "./pages/Search/Search.tsx"),
  ]),
] satisfies RouteConfig;
