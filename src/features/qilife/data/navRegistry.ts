export const navGroups = [
  {
    id: "home",
    label: "",
    items: [{ id: "home", label: "Home", entityKey: null }]
  },
  {
    id: "today",
    label: "Today",
    items: [
      { id: "task", label: "Tasks", entityKey: "task" },
      { id: "reminder", label: "Reminders", entityKey: "reminder" },
      { id: "appointment", label: "Appointments", entityKey: "appointment" }
    ]
  },
  {
    id: "life",
    label: "Life",
    items: [
      { id: "person", label: "People", entityKey: "person" },
      { id: "project", label: "Projects", entityKey: "project" },
      { id: "document", label: "Documents", entityKey: "document" }
    ]
  },
  {
    id: "care",
    label: "Care",
    items: [
      { id: "care_note", label: "Care Notes", entityKey: "care_note" },
      { id: "appointment_care", label: "Appointments", entityKey: "appointment" }
    ]
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "expense", label: "Expenses", entityKey: "expense" },
      { id: "legal_matter", label: "Legal Matters", entityKey: "legal_matter" },
      { id: "home_item", label: "Home Items", entityKey: "home_item" }
    ]
  }
];
