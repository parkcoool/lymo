import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderLogo from "@/components/shared/HeaderLogo";
import SettingBottomSheet from "@/components/shared/SettingBottomSheet";
import { colors } from "@/constants/colors";

import { styles } from "./Header.styles";

interface HeaderProps extends NativeStackHeaderProps {
  backgroundColor?: string;
  showLogo?: boolean;
}

export default function Header({
  back,
  navigation,
  backgroundColor,
  showLogo = false,
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
          {showLogo && <HeaderLogo />}

          {/* 검색 박스 */}
          {/* <SearchBoxLink style={styles.searchBox} /> */}
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
