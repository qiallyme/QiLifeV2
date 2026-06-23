import type { QiEntityDefinition, QiField, QiRecord } from "../types";

export function getRecordValue(record: QiRecord, key: string): unknown {
  if (key === "title") return record.title;
  if (key === "status") return record.status;
  if (key === "priority") return record.priority;
  if (key === "due_date") return record.due_date;
  return record.data?.[key];
}

export function formatValue(value: unknown, field?: QiField): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";

  if (field?.type === "currency") {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(num);
    }
  }

  if (field?.type === "date" || field?.type === "datetime") {
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return field.type === "datetime" ? date.toLocaleString() : date.toLocaleDateString();
    }
  }

  return String(value);
}

export function recordTitleForEntity(record: QiRecord, entity: QiEntityDefinition): string {
  const value = getRecordValue(record, entity.titleField);
  return value ? String(value) : record.title;
}

export function mapFormValuesToRecord(entity: QiEntityDefinition, values: Record<string, unknown>) {
  const titleValue = values[entity.titleField] || values.title || values.name || values.subject || values.text;
  const statusValue = entity.statusField ? values[entity.statusField] : values.status;
  const priorityValue = entity.priorityField ? values[entity.priorityField] : values.priority;
  const dueValue = entity.dueDateField ? values[entity.dueDateField] : values.due_date;

  return {
    title: String(titleValue || "Untitled"),
    status: statusValue ? String(statusValue) : null,
    priority: priorityValue ? String(priorityValue) : null,
    due_date: dueValue ? String(dueValue) : null,
    data: values
  };
}
