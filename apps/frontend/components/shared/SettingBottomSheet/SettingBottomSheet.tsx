import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";

import Wrapper from "./Wrapper";

type SettingViews = "main" | "sync" | "translate";
interface SettingBottomSheetProps {
  ref?: React.Ref<BottomSheetModal>;
}

export default function SettingBottomSheet({ ref }: SettingBottomSheetProps) {
  const [view, setView] = useState<SettingViews>("main");

  const renderContent = () => {
    switch (view) {
      default:
        return null;
    }
  };

  return <Wrapper ref={ref}>{renderContent()}</Wrapper>;
}
