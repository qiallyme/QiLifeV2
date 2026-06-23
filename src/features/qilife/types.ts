export type QiFieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "enum"
  | "tags"
  | "relation"
  | "checkbox"
  | "url";

export type QiLayout = "table" | "cards" | "kanban";

export interface QiField {
  key: string;
  label: string;
  type: QiFieldType;
  primary?: boolean;
  required?: boolean;
  options?: string[];
  relationEntity?: string;
  locked?: boolean;
  placeholder?: string;
}

export interface QiEntityDefinition {
  key: string;
  label: string;
  plural: string;
  icon?: string;
  section: string;
  description: string;
  defaultLayout: QiLayout;
  titleField: string;
  statusField?: string;
  priorityField?: string;
  dueDateField?: string;
  fields: QiField[];
  columns: string[];
}

export interface QiRecord {
  id: string;
  owner_id?: string;
  entity_key: string;
  title: string;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  data: Record<string, unknown>;
  source?: string;
  created_at?: string;
  updated_at?: string;
  archived_at?: string | null;
}

export interface QiCreateRecordInput {
  entity_key: string;
  title: string;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  data?: Record<string, unknown>;
}

export interface QiUpdateRecordInput {
  title?: string;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  data?: Record<string, unknown>;
}
