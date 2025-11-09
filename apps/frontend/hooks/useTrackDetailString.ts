interface UseTrackDetailStringProps {
  artist: string;
  album: string | null;
  publishedAt: string | null;
}

export default function useTrackDetailString({
  artist,
  album,
  publishedAt,
}: UseTrackDetailStringProps) {
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;
  return [artist, album, year].filter(Boolean).join(" • ");
}
