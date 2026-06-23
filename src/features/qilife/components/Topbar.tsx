interface TopbarProps {
  activeLabel: string;
  storeMode: "supabase" | "localStorage";
  onQuickCapture: () => void;
}

export function Topbar({ activeLabel, storeMode, onQuickCapture }: TopbarProps) {
  return (
    <header className="qilife-topbar">
      <div>
        <div className="qilife-eyebrow">QILIFE</div>
        <h1>{activeLabel}</h1>
      </div>

      <div className="qilife-topbar-actions">
        <div className={`qilife-store-pill ${storeMode === "supabase" ? "online" : "local"}`}>
          {storeMode === "supabase" ? "Supabase" : "Local demo"}
        </div>

        <button className="qilife-btn primary" type="button" onClick={onQuickCapture}>
          + Capture
        </button>
      </div>
    </header>
  );
}
