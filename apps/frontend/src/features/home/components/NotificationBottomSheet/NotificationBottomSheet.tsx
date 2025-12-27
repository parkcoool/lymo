import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaModule } from "@/core/mediaModule";
import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import { useSettingStore } from "@/entities/setting/models/settingStore";

import { styles } from "./styles";

export default function NotificationBottomSheet() {
  const { setting } = useSettingStore();

  if (setting.notificationFrequency) return null;
  return <Content />;
}

function Content() {
  const { bottom } = useSafeAreaInsets();
  const granted = useCheckNotificationPermission();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    let timeout: number | undefined;
    if (!granted)
      timeout = setTimeout(() => {
        ref.current?.present();
      }, 1000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [granted]);

  if (granted) return null;

  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaModule.requestNotificationPermission();
  };

  // 모달 닫기 핸들러
  const handleDismiss = () => {
    // 빈도 기본값으로 설정
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
    >
      <BottomSheetView style={styles.content}>
        {/* 상단 */}
        <View style={styles.top}>
          <Text style={styles.title}>듣고 계신 음악의 인사이트를 가끔씩 전달해드릴게요.</Text>
          <Text style={styles.description}>인사이트 빈도도 설정에서 정할 수 있어요.</Text>
        </View>

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
