import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";

import Main from "./Main";
import Sync from "./Sync";
import Translate from "./Translate";
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

  // 렌더링할 내용 결정
  const renderContent = () => {
    switch (view) {
      case "main":
        return <Main setView={setView} />;
      case "sync":
        return <Sync />;
      case "translate":
        return <Translate />;
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
