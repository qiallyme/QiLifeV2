import { useMemo, useState } from "react";
import type { QiEntityDefinition, QiField, QiRecord } from "../types";
import { getRecordValue } from "../utils/recordValues";

interface EntityFormModalProps {
  entity: QiEntityDefinition;
  record?: QiRecord;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>, record?: QiRecord) => Promise<void>;
  onArchive?: (record: QiRecord) => Promise<void>;
}

function defaultValueForField(field: QiField, record?: QiRecord) {
  if (record) {
    const value = getRecordValue(record, field.key);
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value;
    return value === null || value === undefined ? "" : String(value);
  }

  if (field.type === "checkbox") return false;
  if (field.type === "enum") return field.options?.[0] || "";
  return "";
}

function coerceValue(field: QiField, value: string | boolean): unknown {
  if (field.type === "checkbox") return Boolean(value);
  if (field.type === "number" || field.type === "currency") {
    if (value === "") return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }
  if (field.type === "tags") {
    return String(value)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return value === "" ? null : value;
}

export function EntityFormModal({ 
  entity, 
  record, 
  mode, 
  onClose, 
  onSubmit, 
  onArchive 
}: EntityFormModalProps) {
  const initialValues = useMemo(() => {
    return Object.fromEntries(
      entity.fields.map((field) => [field.key, defaultValueForField(field, record)])
    );
  }, [entity.fields, record]);

  const [values, setValues] = useState<Record<string, string | boolean>>(
    initialValues as Record<string, string | boolean>
  );
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(field: QiField, value: string | boolean) {
    setValues((current) => ({ ...current, [field.key]: value }));
  }

  async function submit() {
    setError(null);
    
    // Check required fields
    for (const field of entity.fields) {
      if (field.required && !String(values[field.key] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    const coerced = Object.fromEntries(
      entity.fields.map((field) => [field.key, coerceValue(field, values[field.key])])
    );

    try {
      setSaving(true);
      await onSubmit(coerced, record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  async function handleArchiveClick() {
    if (!record || !onArchive) return;
    const ok = window.confirm(`Are you sure you want to archive "${record.title}"?`);
    if (!ok) return;

    try {
      setArchiving(true);
      setError(null);
      await onArchive(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed.");
      setArchiving(false);
    }
  }

  return (
    <div className="qilife-modal-backdrop">
      <div className="qilife-modal large">
        <div className="qilife-modal-header">
          <div>
            <div className="qilife-eyebrow">{mode === "create" ? "CREATE" : "EDIT"}</div>
            <h2>{mode === "create" ? `New ${entity.label}` : `Edit ${entity.label}`}</h2>
          </div>
          <button 
            className="qilife-mini-btn" 
            type="button" 
            onClick={onClose}
            disabled={saving || archiving}
          >
            Close
          </button>
        </div>

        {error && <div className="qilife-error compact">{error}</div>}

        <div className="qilife-form-grid">
          {entity.fields.map((field) => (
            <label key={field.key} className={`qilife-label ${field.type === "textarea" ? "wide" : ""}`}>
              {field.label}{field.required ? " *" : ""}

              {field.type === "textarea" ? (
                <textarea
                  rows={5}
                  value={String(values[field.key] ?? "")}
                  placeholder={field.placeholder}
                  disabled={saving || archiving}
                  onChange={(event) => setField(field, event.target.value)}
                />
              ) : field.type === "enum" ? (
                <select 
                  value={String(values[field.key] ?? "")} 
                  disabled={saving || archiving}
                  onChange={(event) => setField(field, event.target.value)}
                >
                  <option value="">—</option>
                  {(field.options || []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <span className="qilife-checkbox-row">
                  <input
                    type="checkbox"
                    checked={Boolean(values[field.key])}
                    disabled={saving || archiving}
                    onChange={(event) => setField(field, event.target.checked)}
                  />
                  <span>Yes</span>
                </span>
              ) : (
                <input
                  type={
                    field.type === "date" 
                      ? "date" 
                      : field.type === "datetime" 
                        ? "datetime-local" 
                        : field.type === "currency" || field.type === "number" 
                          ? "number" 
                          : field.type === "url" 
                            ? "url" 
                            : "text"
                  }
                  value={String(values[field.key] ?? "")}
                  placeholder={field.placeholder}
                  disabled={saving || archiving}
                  onChange={(event) => setField(field, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>

        <div className="qilife-actions wrap modal-actions" style={{ justifyContent: "space-between", marginTop: "24px" }}>
          <div>
            {mode === "edit" && onArchive && (
              <button
                className="qilife-btn danger"
                type="button"
                onClick={handleArchiveClick}
                disabled={saving || archiving}
              >
                {archiving ? "Archiving..." : "Archive Record"}
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              className="qilife-btn" 
              type="button" 
              onClick={onClose}
              disabled={saving || archiving}
            >
              Cancel
            </button>
            <button 
              className="qilife-btn primary" 
              type="button" 
              onClick={submit} 
              disabled={saving || archiving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
