import { useMemo, useState } from "react";
import type { QiEntityDefinition, QiField, QiRecord } from "../types";
import { getRecordValue } from "../utils/recordValues";

interface EntityFormModalProps {
  entity: QiEntityDefinition;
  record?: QiRecord;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>, record?: QiRecord) => Promise<void>;
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
    if (value === "") return "";
    const num = Number(value);
    return Number.isNaN(num) ? "" : num;
  }
  if (field.type === "tags") {
    return String(value)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return value;
}

export function EntityFormModal({ entity, record, mode, onClose, onSubmit }: EntityFormModalProps) {
  const initialValues = useMemo(() => {
    return Object.fromEntries(entity.fields.map((field) => [field.key, defaultValueForField(field, record)]));
  }, [entity.fields, record]);

  const [values, setValues] = useState<Record<string, string | boolean>>(initialValues as Record<string, string | boolean>);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(field: QiField, value: string | boolean) {
    setValues((current) => ({ ...current, [field.key]: value }));
  }

  async function submit() {
    setError(null);
    const primaryField = entity.fields.find((field) => field.primary) || entity.fields[0];
    if (primaryField?.required && !String(values[primaryField.key] || "").trim()) {
      setError(`${primaryField.label} is required.`);
      return;
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

  return (
    <div className="qilife-modal-backdrop">
      <div className="qilife-modal large">
        <div className="qilife-modal-header">
          <div>
            <div className="qilife-eyebrow">{mode === "create" ? "CREATE" : "EDIT"}</div>
            <h2>{mode === "create" ? `New ${entity.label}` : `Edit ${entity.label}`}</h2>
          </div>
          <button className="qilife-mini-btn" type="button" onClick={onClose}>Close</button>
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
                  onChange={(event) => setField(field, event.target.value)}
                />
              ) : field.type === "enum" ? (
                <select value={String(values[field.key] ?? "")} onChange={(event) => setField(field, event.target.value)}>
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
                    onChange={(event) => setField(field, event.target.checked)}
                  />
                  <span>Yes</span>
                </span>
              ) : (
                <input
                  type={field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : field.type === "currency" || field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                  value={String(values[field.key] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(event) => setField(field, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>

        <div className="qilife-actions end modal-actions">
          <button className="qilife-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="qilife-btn primary" type="button" onClick={submit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
