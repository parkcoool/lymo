import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { SettingViews } from "@/entities/setting/models/types";

import SettingMenu from "../BottomSheetMenu";
import Language from "../LanguageSetting";
import Sync from "../SyncSetting";

import { styles } from "./styles";

interface SettingBottomSheetProps {
  ref?: React.Ref<BottomSheetModal>;
  defaultView?: SettingViews;
}

export default function SettingBottomSheet({ ref, defaultView = "menu" }: SettingBottomSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const [view, setView] = useState<SettingViews>(defaultView);

  const handleDismiss = () => {
    setView(defaultView);
  };

  // 렌더링할 내용 결정
  const renderContent = () => {
    switch (view) {
      case "menu":
        return <SettingMenu setView={setView} />;
      case "sync":
        return <Sync />;
      case "language":
        return <Language />;
      default:
        return null;
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={handleDismiss}
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
      <BottomSheetView style={styles.content}>{renderContent()}</BottomSheetView>
    </BottomSheetModal>
  );
}
