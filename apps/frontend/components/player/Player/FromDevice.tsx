import useRetrieveTrack from "@/hooks/queries/useRetrieveTrack";

import StoryRequest from "./StoryRequest";

interface FromDeviceProps {
  title: string;
  artist: string;
  durationInSeconds: number;
}

export default function FromDevice(props: FromDeviceProps) {
  const { data: track } = useRetrieveTrack(props);

  return <StoryRequest track={track?.data} {...props} />;
}
