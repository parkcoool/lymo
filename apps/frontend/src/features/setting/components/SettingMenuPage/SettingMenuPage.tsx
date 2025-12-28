import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrivacyTipItem from "./PrivacyTipItem";
import SectionNote from "./SectionNote";
import { styles } from "./styles";
import Sync from "./Sync";
import TranslateLanguage from "./TranslateLanguage";

export default function SettingMenuPage() {
  return (
    <ScrollView style={styles.container}>
      {/* 상단 영역 */}
      <SafeAreaView edges={["top"]} style={styles.safeArea} />

      <View style={styles.content}>
        {/* 설정 항목들 */}
        <View style={styles.itemContainer}>
          {/* 번역 대상 언어 */}
          <TranslateLanguage />

          {/* 문단 이해하기 */}
          <SectionNote />

          <View style={styles.divider} />

          {/* 기기 음악 연동 */}
          <Sync />

          <View style={styles.divider} />

          <PrivacyTipItem />
        </View>
      </View>
    </ScrollView>
  );
}
