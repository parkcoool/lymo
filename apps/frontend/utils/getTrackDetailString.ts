interface GetTrackDetailStringProps {
  artist: string;
  album: string | null;
  publishedAt: string | null;
}

export default function getTrackDetailString({
  artist,
  album,
  publishedAt,
}: GetTrackDetailStringProps) {
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;
  return [artist, album, year].filter(Boolean).join(" • ");
}
