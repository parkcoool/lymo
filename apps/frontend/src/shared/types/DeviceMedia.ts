// 'onMediaDataChanged' 이벤트가 전달하는 데이터의 타입을 정의합니다.

export type DeviceMedia = {
  title: string;
  artist: string;
  album: string | null;
  durationInSeconds: number;
  isPlaying: boolean;
  albumArtBase64?: string;
};
