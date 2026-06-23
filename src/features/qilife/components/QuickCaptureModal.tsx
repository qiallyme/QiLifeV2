import { useState } from "react";
import { entityList, entityRegistry } from "../data/entityRegistry";
import { createRecord } from "../services/qilifeStore";

interface QuickCaptureModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export function QuickCaptureModal({ onClose, onSaved }: QuickCaptureModalProps) {
  const [entityKey, setEntityKey] = useState("task");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const clean = text.trim();
    if (!clean) {
      setError("Capture text is required.");
      return;
    }

    const entity = entityRegistry[entityKey];
    const statusField = entity.fields.find((field) => field.key === "status");
    const defaultStatus = statusField?.options?.[0] || null;

    try {
      setSaving(true);
      setError(null);
      await createRecord({
        entity_key: entityKey,
        title: clean,
        status: defaultStatus,
        data: {
          [entity.titleField]: clean,
          notes,
          captured_at: new Date().toISOString()
        }
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Capture failed.");
      setSaving(false);
    }
  }

  return (
    <div className="qilife-modal-backdrop">
      <div className="qilife-modal">
        <div className="qilife-modal-header">
          <div>
            <div className="qilife-eyebrow">UNIVERSAL INBOX</div>
            <h2>Quick Capture</h2>
          </div>
          <button className="qilife-mini-btn" type="button" onClick={onClose}>Close</button>
        </div>

        {error && <div className="qilife-error compact">{error}</div>}

        <label className="qilife-label">
          Capture as
          <select value={entityKey} onChange={(event) => setEntityKey(event.target.value)}>
            {entityList.map((entity) => (
              <option key={entity.key} value={entity.key}>{entity.icon} {entity.label}</option>
            ))}
          </select>
        </label>

        <label className="qilife-label">
          What is it?
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleSave();
            }}
            placeholder="Dump the thought. Sort later."
            autoFocus
          />
        </label>

        <label className="qilife-label">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Context, links, who/what/why, receipts, next action..."
            rows={5}
          />
        </label>

        <div className="qilife-actions end modal-actions">
          <button className="qilife-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="qilife-btn primary" type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Capture"}
          </button>
        </div>
      </div>
    </div>
  );
}
