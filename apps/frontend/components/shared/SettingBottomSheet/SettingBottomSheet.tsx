import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";

import Main from "./Main";
import Wrapper from "./Wrapper";

export type SettingViews = "main" | "sync" | "translate";

interface SettingBottomSheetProps {
  ref?: React.Ref<BottomSheetModal>;
}

export default function SettingBottomSheet({ ref }: SettingBottomSheetProps) {
  const [view, setView] = useState<SettingViews>("main");

  const handleDismiss = () => {
    setView("main");
  };

  const renderContent = () => {
    switch (view) {
      case "main":
        return <Main setView={setView} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper ref={ref} onDismiss={handleDismiss}>
      {renderContent()}
    </Wrapper>
  );
}
