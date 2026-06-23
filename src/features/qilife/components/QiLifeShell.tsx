import { useEffect, useMemo, useState } from "react";
import { entityRegistry } from "../data/entityRegistry";
import { getStoreMode, seedDemoData, isSupabaseConfigured } from "../services/qilifeStore";
import { EntityPage } from "./EntityPage";
import { HomeDashboard } from "./HomeDashboard";
import { QuickCaptureModal } from "./QuickCaptureModal";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "./Topbar";
import { useAuth } from "../auth/useAuth";
import { LoginPage } from "../auth/LoginPage";
import type { QiRecord } from "../types";

export function QiLifeShell() {
  const { user, loading } = useAuth();
  const [localBypass, setLocalBypass] = useState(false);
  const [activeEntityKey, setActiveEntityKey] = useState<string | null>(null);
  const [autoEditRecord, setAutoEditRecord] = useState<QiRecord | null>(null);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [booted, setBooted] = useState(false);

  const isConfigured = isSupabaseConfigured();
  const showLogin = isConfigured && !user && !localBypass;

  const activeEntity = useMemo(
    () => (activeEntityKey ? entityRegistry[activeEntityKey] : null),
    [activeEntityKey]
  );

  useEffect(() => {
    setBooted(false);
    
    const isLocal = !isConfigured || localBypass || !user;
    if (isLocal) {
      seedDemoData()
        .catch((error) => console.warn("Demo seed skipped:", error))
        .finally(() => setBooted(true));
    } else {
      setBooted(true);
    }
  }, [isConfigured, user, localBypass]);

  function bumpRefresh() {
    setRefreshToken((value) => value + 1);
  }

  function handleOpenEntity(entityKey: string, record?: QiRecord) {
    setActiveEntityKey(entityKey);
    if (record) {
      setAutoEditRecord(record);
    }
  }

  if (loading) {
    return (
      <div className="qilife-app" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="qilife-empty">Connecting to QiLife...</div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <LoginPage 
        showBypass={true} 
        onBypassLocal={() => setLocalBypass(true)} 
      />
    );
  }

  const storeMode = getStoreMode(!!user && !localBypass);

  return (
    <div className="qilife-app">
      <Topbar
        activeLabel={activeEntity?.plural || "Home"}
        storeMode={storeMode}
        userEmail={user?.email}
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
            <EntityPage 
              entity={activeEntity} 
              refreshToken={refreshToken} 
              autoEditRecord={autoEditRecord}
              onClearAutoEdit={() => setAutoEditRecord(null)}
            />
          ) : (
            <HomeDashboard 
              onOpenEntity={handleOpenEntity} 
              refreshToken={refreshToken} 
            />
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
export default QiLifeShell;
