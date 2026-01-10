import { Language } from "@lymo/schemas/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppRegistry, LogBox } from "react-native";

import MediaInsightServiceModule from "modules/media-insight-service";
import MediaNotificationListenerModule from "modules/media-notification-listener";

import retrieveTrackNoti from "@/entities/noti/api/retrieveTrackNoti";
import isSettingJSON from "@/entities/setting/utils/isSettingJSON";
import parseSettingJSON from "@/entities/setting/utils/parseSettingJSON";

// 개발 중 Headless Task 중복 등록 경고 무시
LogBox.ignoreLogs([
  "registerHeadlessTask or registerCancellableHeadlessTask called multiple times",
]);

/**
 * MediaInsightService에서 트리거된 Headless Task
 */
const MediaInsightTask = async (data: {
  title: string;
  artist: string;
  duration: number;
  packageName?: string;
}) => {
  console.log(data.title, data.artist, data.duration, data.packageName);
  try {
    // 1) 언어 설정 가져오기
    let language: Language = "ko";

    const settingString = await AsyncStorage.getItem("setting");
    if (settingString) {
      try {
        const settingJSON = JSON.parse(settingString);
        if (isSettingJSON(settingJSON)) {
          const parsed = parseSettingJSON(settingJSON);
          language = parsed.language;
        }
      } catch (error) {
        console.error("[MediaInsightTask] Failed to parse settings:", error);
      }
    }

    // 2) Firebase Cloud Functions에서 인사이트 가져오기
    const { data: response } = await retrieveTrackNoti({
      title: data.title,
      artist: data.artist,
      durationInSeconds: Math.floor(data.duration / 1000), // ms → seconds
      language,
    });

    if (!response.success || !response.data) {
      console.log("[MediaInsightTask] No insight data received");
      return;
    }

    const message = response.data;

    // 3) 현재 재생 중인 트랙 확인 (다른 곡으로 넘어갔을 수 있음)
    const deviceMedia = await MediaNotificationListenerModule.getCurrentMediaSession();
    if (!deviceMedia.hasSession || deviceMedia.title !== data.title) {
      console.log("[MediaInsightTask] Track changed, skipping notification");
      return;
    }

    // 4) 알림 표시
    MediaInsightServiceModule.showInsightNotification(data.title, message);
    console.log("[MediaInsightTask] Notification shown successfully");
  } catch (error) {
    console.error("[MediaInsightTask] Error:", error);
  }
};

AppRegistry.registerHeadlessTask("MediaInsightTask", () => MediaInsightTask);
