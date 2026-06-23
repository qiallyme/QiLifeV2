import type { QiEntityDefinition } from "../types";

export const entityRegistry: Record<string, QiEntityDefinition> = {
  person: {
    key: "person",
    label: "Person",
    plural: "People",
    icon: "👥",
    section: "people",
    description: "Family, support network, providers, contacts, and context.",
    defaultLayout: "table",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", primary: true, required: true, placeholder: "Lisa, Zai, Dr. Smith..." },
      { key: "role", label: "Role", type: "text", placeholder: "Mom, landlord, provider..." },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "relationship", label: "Relationship", type: "text" },
      { key: "tags", label: "Tags", type: "tags", placeholder: "care, family, urgent" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["name", "role", "phone", "email", "relationship"]
  },

  task: {
    key: "task",
    label: "Task",
    plural: "Tasks",
    icon: "✅",
    section: "today",
    description: "Daily action, next steps, waiting items, and loose ends.",
    defaultLayout: "table",
    titleField: "title",
    statusField: "status",
    priorityField: "priority",
    dueDateField: "due_date",
    fields: [
      { key: "title", label: "Title", type: "text", primary: true, required: true, placeholder: "Call clinic, pay bill, upload receipt..." },
      { key: "status", label: "Status", type: "enum", options: ["inbox", "next", "waiting", "done", "cancelled"] },
      { key: "priority", label: "Priority", type: "enum", options: ["low", "medium", "high", "urgent"] },
      { key: "due_date", label: "Due", type: "date" },
      { key: "project", label: "Project", type: "relation", relationEntity: "project" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["title", "status", "priority", "due_date", "project"]
  },

  project: {
    key: "project",
    label: "Project",
    plural: "Projects",
    icon: "🗂️",
    section: "projects",
    description: "Active builds, repairs, systems, and major life containers.",
    defaultLayout: "cards",
    titleField: "name",
    statusField: "status",
    priorityField: "priority",
    dueDateField: "due_date",
    fields: [
      { key: "name", label: "Name", type: "text", primary: true, required: true, placeholder: "QiLife MVP, Mom care binder, house safety..." },
      { key: "status", label: "Status", type: "enum", options: ["active", "on_hold", "backlog", "done", "cancelled"] },
      { key: "priority", label: "Priority", type: "enum", options: ["low", "medium", "high"] },
      { key: "owner", label: "Owner", type: "relation", relationEntity: "person" },
      { key: "due_date", label: "Due", type: "date" },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "brief", label: "Brief", type: "textarea" }
    ],
    columns: ["name", "status", "priority", "owner", "due_date"]
  },

  care_note: {
    key: "care_note",
    label: "Care Note",
    plural: "Care Notes",
    icon: "🫀",
    section: "care",
    description: "Care observations, symptoms, meds, incidents, supplies, and follow-ups.",
    defaultLayout: "table",
    titleField: "subject",
    fields: [
      { key: "subject", label: "Subject", type: "text", primary: true, required: true, placeholder: "Arm swelling, oxygen issue, appointment update..." },
      { key: "person", label: "Person", type: "relation", relationEntity: "person" },
      { key: "category", label: "Category", type: "enum", options: ["symptom", "medication", "appointment", "incident", "supply", "general"] },
      { key: "when", label: "When", type: "datetime" },
      { key: "severity", label: "Severity", type: "enum", options: ["low", "medium", "high", "urgent"] },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["subject", "person", "category", "severity", "when"]
  },

  appointment: {
    key: "appointment",
    label: "Appointment",
    plural: "Appointments",
    icon: "📅",
    section: "care",
    description: "Medical, legal, finance, home, and support appointments.",
    defaultLayout: "table",
    titleField: "title",
    statusField: "status",
    fields: [
      { key: "title", label: "Title", type: "text", primary: true, required: true },
      { key: "person", label: "Person", type: "relation", relationEntity: "person" },
      { key: "provider", label: "Provider", type: "text" },
      { key: "when", label: "When", type: "datetime" },
      { key: "status", label: "Status", type: "enum", options: ["scheduled", "completed", "cancelled", "reschedule"] },
      { key: "location", label: "Location", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["title", "person", "provider", "when", "status"]
  },

  expense: {
    key: "expense",
    label: "Expense",
    plural: "Expenses",
    icon: "🧾",
    section: "finance",
    description: "Receipts, household purchases, rent deductions, bills, and costs.",
    defaultLayout: "table",
    titleField: "description",
    fields: [
      { key: "description", label: "Description", type: "text", primary: true, required: true },
      { key: "amount", label: "Amount", type: "currency" },
      { key: "account", label: "Account", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "receipt_url", label: "Receipt URL", type: "url" },
      { key: "reimbursable", label: "Reimbursable", type: "checkbox" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["description", "amount", "account", "category", "date"]
  },

  document: {
    key: "document",
    label: "Document",
    plural: "Documents",
    icon: "📄",
    section: "documents",
    description: "Drive/QiNexus linked documents and source files.",
    defaultLayout: "table",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", primary: true, required: true },
      { key: "domain", label: "Domain", type: "enum", options: ["life", "care", "finance", "legal", "home", "tech", "identity"] },
      { key: "file_url", label: "File URL", type: "url" },
      { key: "related_person", label: "Related Person", type: "relation", relationEntity: "person" },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["title", "domain", "related_person", "file_url"]
  },

  legal_matter: {
    key: "legal_matter",
    label: "Legal Matter",
    plural: "Legal Matters",
    icon: "⚖️",
    section: "legal",
    description: "Matters, deadlines, evidence, filings, and event trails.",
    defaultLayout: "cards",
    titleField: "title",
    statusField: "status",
    dueDateField: "deadline",
    fields: [
      { key: "title", label: "Title", type: "text", primary: true, required: true },
      { key: "status", label: "Status", type: "enum", options: ["active", "waiting", "filed", "resolved", "closed"] },
      { key: "jurisdiction", label: "Jurisdiction", type: "text" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "opposing_party", label: "Other Party", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["title", "status", "jurisdiction", "deadline"]
  },

  home_item: {
    key: "home_item",
    label: "Home Item",
    plural: "Home Items",
    icon: "🏠",
    section: "home",
    description: "Safety items, repairs, supplies, installations, and household inventory.",
    defaultLayout: "table",
    titleField: "name",
    statusField: "status",
    fields: [
      { key: "name", label: "Name", type: "text", primary: true, required: true },
      { key: "category", label: "Category", type: "enum", options: ["safety", "repair", "supply", "furniture", "utility", "cleaning", "other"] },
      { key: "status", label: "Status", type: "enum", options: ["needed", "bought", "installed", "returned", "done"] },
      { key: "cost", label: "Cost", type: "currency" },
      { key: "location", label: "Location", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["name", "category", "status", "cost", "location"]
  },

  reminder: {
    key: "reminder",
    label: "Reminder",
    plural: "Reminders",
    icon: "🔔",
    section: "today",
    description: "Simple reminders and nagging loose ends that need a visible home.",
    defaultLayout: "table",
    titleField: "text",
    statusField: "status",
    fields: [
      { key: "text", label: "Text", type: "text", primary: true, required: true },
      { key: "when", label: "When", type: "datetime" },
      { key: "status", label: "Status", type: "enum", options: ["open", "done", "cancelled"] },
      { key: "notes", label: "Notes", type: "textarea" }
    ],
    columns: ["text", "when", "status"]
  }
};

export const entityList = Object.values(entityRegistry);
