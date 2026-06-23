import { useAuth } from "../auth/useAuth";

interface TopbarProps {
  activeLabel: string;
  storeMode: "supabase" | "localStorage";
  userEmail?: string;
  onQuickCapture: () => void;
}

export function Topbar({ activeLabel, storeMode, userEmail, onQuickCapture }: TopbarProps) {
  const { signOut } = useAuth();

  return (
    <header className="qilife-topbar">
      <div>
        <div className="qilife-eyebrow">QILIFE</div>
        <h1>{activeLabel}</h1>
      </div>

      <div className="qilife-topbar-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className={`qilife-store-pill ${storeMode === "supabase" ? "online" : "local"}`}>
          {storeMode === "supabase" ? "Supabase Connected" : "Local Mode"}
        </div>

        {storeMode === "supabase" && userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
            <span style={{ color: "var(--qi-muted)" }} title={userEmail}>
              Signed in as <strong style={{ color: "var(--qi-text)" }}>{userEmail}</strong>
            </span>
            <button
              className="qilife-mini-btn danger"
              type="button"
              onClick={() => signOut().catch(console.error)}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              Sign Out
            </button>
          </div>
        )}

        <button className="qilife-btn primary" type="button" onClick={onQuickCapture}>
          + Capture
        </button>
      </div>
    </header>
  );
}
