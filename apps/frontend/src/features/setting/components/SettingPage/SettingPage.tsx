import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/entities/layout/ui/Header";
import SettingItem from "@/entities/setting/ui/SettingItem";

import PrivacyTipItem from "./PrivacyTipItem";
import { styles } from "./styles";
import TranslateLanguage from "./TranslateLanguage";

export default function SettingPage() {
  return (
    <>
      <ScrollView style={styles.container}>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={styles.safeArea} />

        <View style={styles.content}>
          {/* 설정 항목들 */}
          <View style={styles.itemContainer}>
            {/* 번역 대상 언어 */}
            <TranslateLanguage />

            {/* 기기 음악 연동 */}
            <SettingItem
              icon={<MaterialIcons name="music-note" style={styles.icon} size={24} />}
              title="기기 음악 연동"
              description="재생 중인 음악 정보를 인식하기"
            />

            {/* 인사이트 알림 */}
            <SettingItem
              icon={<MaterialIcons name="notifications" style={styles.icon} size={24} />}
              title="인사이트 알림"
              description="재생 중인 음악의 인사이트를 알림으로 받기"
            />

            <View style={styles.divider} />

            <PrivacyTipItem />
          </View>
        </View>
      </ScrollView>

      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => <Header {...props} avatar={false} />,
        }}
      />
    </>
  );
}
