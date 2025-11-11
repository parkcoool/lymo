import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";

import { useSettingStore } from "@/contexts/useSettingStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

import Main from "./Main";
import { getTrackKey } from "./SettingBottomSheet.helpers";
import Sync from "./Sync";
import Wrapper from "./Wrapper";

export type SettingViews = "main" | "sync" | "translate";

interface SettingBottomSheetProps {
  ref?: React.Ref<BottomSheetModal>;
}

export default function SettingBottomSheet({ ref }: SettingBottomSheetProps) {
  const { setting, updateSetting } = useSettingStore();
  const [view, setView] = useState<SettingViews>("main");
  const { trackSource } = useTrackSourceStore();

  // `trackSyncDelay` map의 키로 사용할 트랙 키
  const trackKey = trackSource ? getTrackKey(trackSource) : null;

  const handleDismiss = () => {
    setView("main");
  };

  const renderContent = () => {
    switch (view) {
      case "main":
        return <Main setView={setView} />;
      case "sync":
        if (!trackKey) return null;
        return (
          <Sync
            value={setting.delayMap.get(trackKey) ?? 0}
            onChange={(value) =>
              updateSetting((prev) => {
                const newDelayMap = new Map(prev.delayMap);
                newDelayMap.set(trackKey, value);
                return { ...prev, delayMap: newDelayMap };
              })
            }
          />
        );
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
