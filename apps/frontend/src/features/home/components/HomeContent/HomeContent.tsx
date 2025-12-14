import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DeviceMediaDetection from "@/entities/home/ui/DeviceMedia";
import NotificationAccessRequired from "@/entities/home/ui/NotificationAccessRequired";
import NewTracksSection from "@/features/home/components/NewTracksSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";

import { styles } from "./HomeContent.styles";

export default function HomeContent() {
  return (
    <ScrollView style={styles.container}>
      {/* 상단 영역 */}
      <SafeAreaView edges={["top"]} style={styles.safeArea} />

      {/* 알림 구역 */}
      <View style={styles.notificationContainer}>
        <NotificationAccessRequired />
        <DeviceMediaDetection />
      </View>

      <View style={styles.content}>
        {/* 인기 섹션 */}
        <PopularTracksSection />

        {/* 신규 섹션 */}
        <NewTracksSection />
      </View>
    </ScrollView>
  );
}
