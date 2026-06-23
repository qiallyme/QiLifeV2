import { useEffect, useMemo, useState } from "react";
import { entityRegistry } from "../data/entityRegistry";
import { entityList } from "../data/entityRegistry";
import { listAllRecords } from "../services/qilifeStore";
import type { QiRecord } from "../types";

interface HomeDashboardProps {
  onOpenEntity: (entityKey: string, record?: QiRecord) => void;
  refreshToken: number;
}

const dashboardCards = [
  { title: "Today", description: "Tasks, reminders, and appointments that need attention.", entityKey: "task" },
  { title: "Care", description: "Care notes, symptoms, supplies, appointments, and follow-up.", entityKey: "care_note" },
  { title: "Finance", description: "Expenses, receipts, rent deductions, bills, and money tracking.", entityKey: "expense" },
  { title: "Legal", description: "Matters, deadlines, evidence, filings, and event trails.", entityKey: "legal_matter" },
  { title: "Documents", description: "Drive/QiNexus linked documents and source files.", entityKey: "document" },
  { title: "Projects", description: "Active builds, repairs, systems, and major life containers.", entityKey: "project" }
];

function isDueSoon(record: QiRecord) {
  const date = record.due_date || String(record.data.when || record.data.deadline || "");
  if (!date) return false;
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return false;
  const now = new Date();
  const sevenDays = 1000 * 60 * 60 * 24 * 7;
  return target.getTime() <= now.getTime() + sevenDays;
}

export function HomeDashboard({ onOpenEntity, refreshToken }: HomeDashboardProps) {
  const [records, setRecords] = useState<QiRecord[]>([]);

  useEffect(() => {
    listAllRecords().then(setRecords).catch((error) => console.warn(error));
  }, [refreshToken]);

  const stats = useMemo(() => {
    const byEntity = new Map<string, number>();
    records.forEach((record) => byEntity.set(record.entity_key, (byEntity.get(record.entity_key) || 0) + 1));
    return {
      total: records.length,
      tasks: byEntity.get("task") || 0,
      care: byEntity.get("care_note") || 0,
      dueSoon: records.filter(isDueSoon).length
    };
  }, [records]);

  const recent = records.slice(0, 7);

  return (
    <div className="qilife-page">
      <section className="qilife-hero">
        <div className="qilife-eyebrow">COMMAND CENTER</div>
        <h2>What needs your attention?</h2>
        <p>
          One shell for daily action, care, finance, legal, files, home, people, and projects.
        </p>
      </section>

      <section className="qilife-stat-grid">
        <div className="qilife-stat-card"><span>Total records</span><strong>{stats.total}</strong></div>
        <div className="qilife-stat-card"><span>Tasks</span><strong>{stats.tasks}</strong></div>
        <div className="qilife-stat-card"><span>Care notes</span><strong>{stats.care}</strong></div>
        <div className="qilife-stat-card"><span>Due soon</span><strong>{stats.dueSoon}</strong></div>
      </section>

      <section className="qilife-card-grid">
        {dashboardCards.map((card) => {
          const entity = entityRegistry[card.entityKey];
          const count = records.filter((record) => record.entity_key === card.entityKey).length;

          return (
            <button key={card.entityKey} className="qilife-card" type="button" onClick={() => onOpenEntity(card.entityKey)}>
              <div className="qilife-card-icon">{entity?.icon}</div>
              <div className="qilife-card-title">{card.title}</div>
              <div className="qilife-card-desc">{card.description}</div>
              <div className="qilife-card-meta">{count} {entity?.plural}</div>
            </button>
          );
        })}
      </section>

      <section className="qilife-split-section">
        <div className="qilife-panel">
          <div className="qilife-panel-head">
            <div>
              <div className="qilife-eyebrow">RECENT</div>
              <h3>Latest records</h3>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="qilife-empty compact">No records yet.</div>
          ) : (
            <div className="qilife-list">
              {recent.map((record) => (
                <button 
                  key={record.id} 
                  className="qilife-list-row" 
                  type="button" 
                  onClick={() => onOpenEntity(record.entity_key, record)}
                >
                  <span>{entityRegistry[record.entity_key]?.icon || "•"}</span>
                  <div>
                    <strong>{record.title}</strong>
                    <small>{entityRegistry[record.entity_key]?.label || record.entity_key}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="qilife-panel">
          <div className="qilife-panel-head">
            <div>
              <div className="qilife-eyebrow">REGISTRY</div>
              <h3>Available modules</h3>
            </div>
          </div>
          <div className="qilife-chip-cloud">
            {entityList.map((entity) => (
              <button key={entity.key} type="button" onClick={() => onOpenEntity(entity.key)}>
                {entity.icon} {entity.plural}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
