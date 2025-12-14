import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SettingBottomSheet from "@/features/setting/components/SettingBottomSheet";
import { colors } from "@/shared/constants/colors";

import Brand from "./Brand";
import { styles } from "./styles";

interface HeaderProps extends NativeStackHeaderProps {
  backgroundColor?: string;
  showBrand?: boolean;
}

export default function Header({
  back,
  navigation,
  backgroundColor,
  showBrand = false,
}: HeaderProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handleSettingsOpen = () => bottomSheetRef.current?.present();

  return (
    <View style={styles.container}>
      {/* 그라데이션 오버레이 */}
      <LinearGradient
        style={styles.gradient}
        colors={[backgroundColor ?? colors.background, "transparent"]}
      />

      {/* 상단 영역 */}
      <SafeAreaView edges={["top"]} />

      <View style={styles.header}>
        <View style={styles.left}>
          {/* 뒤로 가기 버튼 */}
          {back && (
            <TouchableOpacity onPress={navigation.goBack}>
              <MaterialIcons name="chevron-left" size={28} style={styles.buttonIcon} />
            </TouchableOpacity>
          )}

          {/* 로고 */}
          {showBrand && <Brand />}
        </View>

        <View style={styles.right}>
          {/* 설정 버튼 */}
          <TouchableOpacity onPress={handleSettingsOpen}>
            <MaterialIcons name="settings" size={28} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 설정 바텀시트 */}
      <SettingBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
