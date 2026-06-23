import { useEffect, useMemo, useState } from "react";
import type { QiEntityDefinition, QiLayout, QiRecord } from "../types";
import { archiveRecord, createRecord, listRecords, updateRecord } from "../services/qilifeStore";
import { EntityCards } from "./EntityCards";
import { EntityFormModal } from "./EntityFormModal";
import { EntityTable } from "./EntityTable";
import { mapFormValuesToRecord } from "../utils/recordValues";

interface EntityPageProps {
  entity: QiEntityDefinition;
  refreshToken: number;
  autoEditRecord?: QiRecord | null;
  onClearAutoEdit?: () => void;
}

export function EntityPage({ entity, refreshToken, autoEditRecord, onClearAutoEdit }: EntityPageProps) {
  const [records, setRecords] = useState<QiRecord[]>([]);
  const [layout, setLayout] = useState<QiLayout>(entity.defaultLayout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState<{ mode: "create" | "edit"; record?: QiRecord } | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const rows = await listRecords(entity.key);
      setRecords(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records.");
    } finally {
      setLoading(false);
    }
  }

  // Trigger modal when an autoEditRecord is supplied from parent (e.g. recent dashboard click)
  useEffect(() => {
    if (autoEditRecord && autoEditRecord.entity_key === entity.key) {
      setModalState({ mode: "edit", record: autoEditRecord });
      if (onClearAutoEdit) onClearAutoEdit();
    }
  }, [entity.key, autoEditRecord, onClearAutoEdit]);

  useEffect(() => {
    setLayout(entity.defaultLayout);
    setSearch("");
  }, [entity.key, entity.defaultLayout]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.key, refreshToken]);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(q));
  }, [records, search]);

  async function handleFormSubmit(values: Record<string, unknown>, record?: QiRecord) {
    const mapped = mapFormValuesToRecord(entity, values);
    if (record) {
      await updateRecord(record.id, mapped);
    } else {
      await createRecord({ entity_key: entity.key, ...mapped });
    }
    setModalState(null);
    await load();
  }

  async function handleArchive(record: QiRecord, skipConfirm = false) {
    if (!skipConfirm) {
      const ok = window.confirm(`Archive "${record.title}"?`);
      if (!ok) return;
    }
    await archiveRecord(record.id);
    setModalState(null);
    await load();
  }

  return (
    <div className="qilife-page">
      <div className="qilife-page-header">
        <div>
          <div className="qilife-eyebrow">{entity.section}</div>
          <h2><span className="qilife-title-icon">{entity.icon}</span>{entity.plural}</h2>
          <p>{entity.description}</p>
        </div>

        <div className="qilife-actions wrap">
          <input
            className="qilife-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${entity.plural.toLowerCase()}...`}
          />

          <button className="qilife-btn" type="button" onClick={() => setLayout(layout === "table" ? "cards" : "table")}>
            {layout === "table" ? "Cards" : "Table"}
          </button>

          <button className="qilife-btn primary" type="button" onClick={() => setModalState({ mode: "create" })}>
            + New {entity.label}
          </button>
        </div>
      </div>

      <div className="qilife-subbar">
        <span>{filteredRecords.length} visible</span>
        <span>{records.length} total</span>
        <span>Layout: {layout}</span>
      </div>

      {loading && <div className="qilife-empty">Loading...</div>}
      {error && <div className="qilife-error">{error}</div>}

      {!loading && !error && filteredRecords.length === 0 && (
        <div className="qilife-empty">No {entity.plural.toLowerCase()} found. Create the first one.</div>
      )}

      {!loading && !error && filteredRecords.length > 0 && layout === "table" && (
        <EntityTable
          entity={entity}
          records={filteredRecords}
          onEdit={(record) => setModalState({ mode: "edit", record })}
          onArchive={handleArchive}
        />
      )}

      {!loading && !error && filteredRecords.length > 0 && layout !== "table" && (
        <EntityCards
          entity={entity}
          records={filteredRecords}
          onEdit={(record) => setModalState({ mode: "edit", record })}
          onArchive={handleArchive}
        />
      )}

      {modalState && (
        <EntityFormModal
          entity={entity}
          record={modalState.record}
          mode={modalState.mode}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
          onArchive={(rec) => handleArchive(rec, true)}
        />
      )}
    </div>
  );
}
