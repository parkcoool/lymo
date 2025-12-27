import { Language } from "@lymo/schemas/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppRegistry, LogBox } from "react-native";

import { MediaModule } from "@/core/mediaModule";
import retrieveTrackNoti from "@/entities/noti/api/retrieveTrackNoti";
import isSettingJSON from "@/entities/setting/utils/isSettingJSON";
import parseSettingJSON from "@/entities/setting/utils/parseSettingJSON";

// 개발 중 Headless Task 중복 등록 경고 무시
LogBox.ignoreLogs([
  "registerHeadlessTask or registerCancellableHeadlessTask called multiple times",
]);

const LymoMediaTask = async (data: { title: string; artist: string; duration: number }) => {
  // 1) 설정 불러오기
  let language: Language;
  const settingString = await AsyncStorage.getItem("setting");

  // 2) 언어 설정 파싱
  if (!settingString) {
    language = "ko";
  } else {
    try {
      const settingJSON = JSON.parse(settingString);
      if (!isSettingJSON(settingJSON)) return;
      const parsed = parseSettingJSON(settingJSON);
      language = parsed.language;
    } catch {
      language = "ko";
    }
  }

  let message: string;
  try {
    // 3) 메시지 가져오기
    const { data: response } = await retrieveTrackNoti({
      ...data,
      durationInSeconds: data.duration,
      language,
    });

    if (!response.success || !response.data) return;
    message = response.data;
  } catch {
    return;
  }

  // 4) 현재 재생 중인 트랙이 아닐 경우 알림 표시 안 함
  const deviceMedia = await MediaModule.getCurrentMediaState();
  if (!deviceMedia || deviceMedia.title !== data.title) return;

  try {
    // 5) 알림 표시
    MediaModule.showInsightNotification(`${data.title}`, message);
  } catch (error) {
    console.error("[HeadlessJS] Error:", error);
  }

  return Promise.resolve();
};

AppRegistry.registerHeadlessTask("LymoMediaTask", () => LymoMediaTask);
