import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./SettingBottomSheet.styles";

interface WrapperProps {
  ref?: React.Ref<BottomSheetModal>;
  children?: React.ReactNode;
}

export default function Wrapper({ ref, children }: WrapperProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
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
      style={styles.modal}
      bottomInset={bottom + 4}
      detached
    >
      <BottomSheetView style={styles.modalContent}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
}
