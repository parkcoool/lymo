import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MediaInsightServiceModule from "modules/media-insight-service";

import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import { useSettingStore } from "@/entities/setting/models/settingStore";

import InsightAnimation from "../InsightAnimation";

import { styles } from "./styles";

export default function InsightBottomSheet() {
  const { updateSetting } = useSettingStore();

  const { bottom } = useSafeAreaInsets();
  const granted = useCheckNotificationPermission();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // 권한이 부여되지 않았으면 모달 표시
    if (!granted) {
      const timeout = setTimeout(() => {
        ref.current?.present();
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [granted]);

  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaInsightServiceModule.requestPostNotificationPermission();
  };

  // 모달 닫기 핸들러
  const handleDismiss = () => {
    // notificationFrequency가 설정되지 않았다면 'never'로 설정
    updateSetting((prev) => {
      if (prev.notificationFrequency === undefined)
        return { ...prev, notificationFrequency: "never" };

      return prev;
    });
  };

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.modalHandleIndicator}
      style={styles.wrapper}
      bottomInset={bottom + 4}
      detached
      activeOffsetY={[-20, 20]}
      failOffsetX={[-20, 20]}
      onDismiss={handleDismiss}
    >
      <BottomSheetView style={styles.content}>
        {/* 상단 */}
        <View style={styles.top}>
          <Text style={styles.title}>듣고 계신 음악의 인사이트를 가끔씩 알려드릴까요?</Text>
          <Text style={styles.description}>얼마나 자주 알려드릴지 설정에서 정할 수 있어요.</Text>
        </View>

        {/* 바디 */}
        <InsightAnimation />

        {/* 푸터 */}
        <View style={styles.footer}>
          {/* 권한 부여 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleGrant}>
            <MaterialIcons name="notifications" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>알림 허용하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
