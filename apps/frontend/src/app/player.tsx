import { ErrorBoundaryProps } from "expo-router";

import ErrorIndicator from "@/features/player/components/ErrorIndicator";
import PlayerPage from "@/features/player/components/PlayerPage";

export default function Page() {
  return <PlayerPage />;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorIndicator {...props} />;
}
