import { entityRegistry } from "../data/entityRegistry";
import { navGroups } from "../data/navRegistry";

interface SidebarNavProps {
  activeEntityKey: string | null;
  onSelectEntity: (entityKey: string) => void;
  onHome: () => void;
}

export function SidebarNav({ activeEntityKey, onSelectEntity, onHome }: SidebarNavProps) {
  return (
    <aside className="qilife-sidebar">
      <button className="qilife-brand" type="button" onClick={onHome}>
        <div className="qilife-brand-mark">◐</div>
        <div>
          <div className="qilife-brand-title">QiLife</div>
          <div className="qilife-brand-subtitle">Life Command</div>
        </div>
      </button>

      <nav className="qilife-nav" aria-label="QiLife navigation">
        {navGroups.map((group) => (
          <section key={group.id} className="qilife-nav-group">
            {group.label && <div className="qilife-nav-group-label">{group.label}</div>}

            {group.items.map((item) => {
              const entity = item.entityKey ? entityRegistry[item.entityKey] : null;
              const active = item.entityKey === activeEntityKey || (!item.entityKey && !activeEntityKey);

              return (
                <button
                  key={item.id}
                  className={`qilife-nav-item ${active ? "active" : ""}`}
                  type="button"
                  onClick={() => (item.entityKey ? onSelectEntity(item.entityKey) : onHome())}
                >
                  <span className="qilife-nav-icon">{entity?.icon || "⌂"}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </section>
        ))}
      </nav>
    </aside>
  );
}
