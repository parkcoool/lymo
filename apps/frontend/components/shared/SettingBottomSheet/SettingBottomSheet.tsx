import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./SettingBottomSheet.styles";

interface SettingBottomSheetProps {
  ref?: React.Ref<BottomSheetModal>;
}

export default function SettingBottomSheet({ ref }: SettingBottomSheetProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          appearsOnIndex={0}
        />
      )}
      style={styles.modal}
      bottomInset={bottom + 4}
      detached
    >
      <BottomSheetView style={{ padding: 16 }}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
