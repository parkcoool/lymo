import { AppRegistry, NativeModules, LogBox } from "react-native";

// 개발 중 Headless Task 중복 등록 경고 무시
LogBox.ignoreLogs([
  "registerHeadlessTask or registerCancellableHeadlessTask called multiple times",
]);

const { MediaModule } = NativeModules;

const LymoMediaTask = async (data: { title: string; artist: string }) => {
  try {
    // const insight = await fetchInsight(data.title);
    const hasInsight = true; // 테스트용

    if (hasInsight) {
      MediaModule.showInsightNotification(
        `${data.title}`,
        `Lymo가 분석한 이 노래의 이야기를 들어보세요.`
      );
    }
  } catch (error) {
    console.error("[HeadlessJS] Error:", error);
  }

  return Promise.resolve();
};

AppRegistry.registerHeadlessTask("LymoMediaTask", () => LymoMediaTask);
