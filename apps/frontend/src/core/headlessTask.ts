import { AppRegistry, NativeModules } from "react-native";

// 여기에 백그라운드에서 실행할 로직을 작성합니다.
const LymoMediaTask = async (data: { title: string; artist: string }) => {
  console.log("[HeadlessJS] Background Detected:", data.title);

  // 예시: 로컬 스토리지 체크나 서버 통신 로직
  // const isSeen = await checkLocalCache(data.title);

  // 예시: 조건이 맞으면 알림 띄우기 (Native Module 호출)
  NativeModules.MediaModule.showInsightNotification(
    `🎵 ${data.title}`,
    "이 곡에 숨겨진 이야기를 확인해보세요!"
  );

  // 주의: Headless JS는 반드시 비동기 함수여야 하며, Promise를 반환해야 합니다.
  return Promise.resolve();
};

AppRegistry.registerHeadlessTask("LymoMediaTask", () => LymoMediaTask);
console.log("Registering Headless Task `LymoMediaTask`");
