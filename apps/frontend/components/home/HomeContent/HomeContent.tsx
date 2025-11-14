import { Suspense } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DeviceMediaDetection from "@/components/home/DeviceMediaDetection";
import NewTracksSection, { NewTracksSectionSkeleton } from "@/components/home/NewTracksSection";
import NotificationAccessRequired from "@/components/home/NotificationAccessRequired";
import PopularTracksSection, {
  PopularTracksSectionSkeleton,
} from "@/components/home/PopularTracksSection";

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
        <Suspense fallback={<PopularTracksSectionSkeleton />}>
          <PopularTracksSection />
        </Suspense>

        {/* 신규 섹션 */}
        <Suspense fallback={<NewTracksSectionSkeleton />}>
          <NewTracksSection />
        </Suspense>
      </View>
    </ScrollView>
  );
}
