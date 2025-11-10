import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";

import type { SettingViews } from "./SettingBottomSheet";
import { getSyncText, getTranslateText } from "./SettingBottomSheet.helpers";
import { styles } from "./SettingBottomSheet.styles";

interface MainProps {
  setView: (view: SettingViews) => void;
}

export default function Main({ setView }: MainProps) {
  const { setting } = useSettingStore();

  return (
    <View style={styles.actionContainer}>
      {/* 가사 싱크 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setView("sync")}
      >
        <View style={styles.actionButtonLeft}>
          <MaterialIcons
            name="sync"
            size={24}
            style={styles.actionButtonIcon}
          />
          <Text style={styles.actionButtonText}>가사 싱크</Text>
        </View>
        <View style={styles.actionButtonRight}>
          <Text style={styles.actionButtonContent}>
            {getSyncText(setting.syncDelay)}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            style={styles.actionButtonIcon}
          />
        </View>
      </TouchableOpacity>

      {/* 번역 언어 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setView("translate")}
      >
        <View style={styles.actionButtonLeft}>
          <MaterialIcons
            name="translate"
            size={24}
            style={styles.actionButtonIcon}
          />
          <Text style={styles.actionButtonText}>번역 언어</Text>
        </View>
        <View style={styles.actionButtonRight}>
          <Text style={styles.actionButtonContent}>
            {getTranslateText(setting.translateTargetLanguage)}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            style={styles.actionButtonIcon}
          />
        </View>
      </TouchableOpacity>

      {/* 요약 보이기 */}
      <View style={styles.actionButton}>
        <View style={styles.actionButtonLeft}>
          <MaterialIcons
            name="summarize"
            size={24}
            style={styles.actionButtonIcon}
          />
          <Text style={styles.actionButtonText}>요약 보이기</Text>
        </View>
        <View style={styles.actionButtonRight}>{/* TODO: 토글 */}</View>
      </View>
    </View>
  );
}
