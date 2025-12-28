import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Content from "./Content";
import { styles } from "./styles";

export default function InsightSettingPage() {
  return (
    <ScrollView style={styles.container}>
      {/* 상단 영역 */}
      <SafeAreaView edges={["top"]} style={styles.safeArea} />

      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>인사이트 알림</Text>
          <Text style={styles.description}>
            기기에서 음악을 재생하면 알림으로 인사이트를 제공해드려요. 모든 음악에 대한 인사이트가
            제공되는 건 아니에요.
          </Text>
        </View>

        <Content />
      </View>
    </ScrollView>
  );
}
