import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MockAdapter from "axios-mock-adapter";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "~/styles/globalStyle";

import type { Route } from "./+types/root";
import api from "./apis";
import useThemeStore from "./contexts/useThemeStore";
import successHandlers from "./mocks/successHandlers";

const queryClient = new QueryClient();

// API 모킹 등록
const mock = new MockAdapter(api);
successHandlers(mock);

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
  {
    rel: "preconnect",
    href: "https://cdn.jsdelivr.net",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
