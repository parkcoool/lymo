import { ErrorBoundaryProps } from "expo-router";

import ErrorIndicator from "@/features/player/components/ErrorIndicator";
import PlayerContent from "@/features/player/components/PlayerContent";

export default function Player() {
  return <PlayerContent />;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorIndicator {...props} />;
}
