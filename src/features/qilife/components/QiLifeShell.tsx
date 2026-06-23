import { useEffect, useMemo, useState } from "react";
import { entityRegistry } from "../data/entityRegistry";
import { getStoreMode, seedDemoData } from "../services/qilifeStore";
import { EntityPage } from "./EntityPage";
import { HomeDashboard } from "./HomeDashboard";
import { QuickCaptureModal } from "./QuickCaptureModal";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "./Topbar";

export function QiLifeShell() {
  const [activeEntityKey, setActiveEntityKey] = useState<string | null>(null);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [booted, setBooted] = useState(false);

  const activeEntity = useMemo(
    () => (activeEntityKey ? entityRegistry[activeEntityKey] : null),
    [activeEntityKey]
  );

  useEffect(() => {
    seedDemoData()
      .catch((error) => console.warn("Demo seed skipped:", error))
      .finally(() => setBooted(true));
  }, []);

  function bumpRefresh() {
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="qilife-app">
      <Topbar
        activeLabel={activeEntity?.plural || "Home"}
        storeMode={getStoreMode()}
        onQuickCapture={() => setCaptureOpen(true)}
      />

      <div className="qilife-body">
        <SidebarNav
          activeEntityKey={activeEntityKey}
          onSelectEntity={setActiveEntityKey}
          onHome={() => setActiveEntityKey(null)}
        />

        <main className="qilife-content">
          {!booted ? (
            <div className="qilife-page"><div className="qilife-empty">Booting QiLife...</div></div>
          ) : activeEntity ? (
            <EntityPage entity={activeEntity} refreshToken={refreshToken} />
          ) : (
            <HomeDashboard onOpenEntity={setActiveEntityKey} refreshToken={refreshToken} />
          )}
        </main>
      </div>

      {captureOpen && (
        <QuickCaptureModal
          onClose={() => setCaptureOpen(false)}
          onSaved={() => {
            bumpRefresh();
            setCaptureOpen(false);
          }}
        />
      )}
    </div>
  );
}
