import { hasSupabaseConfig, supabase } from "../../../lib/supabaseClient";
import type { QiCreateRecordInput, QiRecord, QiUpdateRecordInput } from "../types";

const LOCAL_KEY = "qilife.local.records.v1";

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function readLocalRecords(): QiRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as QiRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLocalRecords(records: QiRecord[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
}

// Get active authenticated user from Supabase session
async function getActiveUser() {
  if (!hasSupabaseConfig || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
  } catch (err) {
    console.error("Auth session retrieval error:", err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseConfig && !!supabase;
}

export function getStoreMode(hasUser: boolean): "supabase" | "localStorage" {
  return (hasSupabaseConfig && supabase && hasUser) ? "supabase" : "localStorage";
}

export async function listRecords(entityKey: string): Promise<QiRecord[]> {
  const user = await getActiveUser();
  if (!user) {
    return readLocalRecords()
      .filter((record) => record.entity_key === entityKey && !record.archived_at)
      .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  }

  const { data, error } = await supabase!
    .schema("qilife")
    .from("records")
    .select("*")
    .eq("entity_key", entityKey)
    .eq("owner_id", user.id)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listAllRecords(): Promise<QiRecord[]> {
  const user = await getActiveUser();
  if (!user) {
    return readLocalRecords()
      .filter((record) => !record.archived_at)
      .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  }

  const { data, error } = await supabase!
    .schema("qilife")
    .from("records")
    .select("*")
    .eq("owner_id", user.id)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createRecord(input: QiCreateRecordInput): Promise<QiRecord> {
  const user = await getActiveUser();
  if (!user) {
    const records = readLocalRecords();
    const record: QiRecord = {
      id: makeId(),
      entity_key: input.entity_key,
      title: input.title,
      status: input.status ?? null,
      priority: input.priority ?? null,
      due_date: input.due_date ?? null,
      data: input.data ?? {},
      source: "qilife-local",
      created_at: nowIso(),
      updated_at: nowIso(),
      archived_at: null
    };
    writeLocalRecords([record, ...records]);
    return record;
  }

  const { data, error } = await supabase!
    .schema("qilife")
    .from("records")
    .insert({
      owner_id: user.id,
      entity_key: input.entity_key,
      title: input.title,
      status: input.status ?? null,
      priority: input.priority ?? null,
      due_date: input.due_date ?? null,
      data: input.data ?? {}
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateRecord(id: string, patch: QiUpdateRecordInput): Promise<QiRecord> {
  const user = await getActiveUser();
  if (!user) {
    const records = readLocalRecords();
    let updated: QiRecord | null = null;
    const next = records.map((record) => {
      if (record.id !== id) return record;
      updated = {
        ...record,
        ...patch,
        data: patch.data ?? record.data,
        updated_at: nowIso()
      };
      return updated;
    });
    writeLocalRecords(next);
    if (!updated) throw new Error("Record not found.");
    return updated;
  }

  const { data, error } = await supabase!
    .schema("qilife")
    .from("records")
    .update(patch)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function archiveRecord(id: string): Promise<void> {
  const user = await getActiveUser();
  if (!user) {
    const records = readLocalRecords();
    writeLocalRecords(
      records.map((record) =>
        record.id === id ? { ...record, archived_at: nowIso(), updated_at: nowIso() } : record
      )
    );
    return;
  }

  const { error } = await supabase!
    .schema("qilife")
    .from("records")
    .update({ archived_at: nowIso() })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw error;
}

export async function seedDemoData(): Promise<void> {
  const user = await getActiveUser();
  if (user) return; // Do not seed data in Supabase mode

  const existing = await listAllRecords();
  if (existing.length > 0) return;

  await createRecord({
    entity_key: "task",
    title: "Review QiLife shell and decide first real module",
    status: "next",
    priority: "high",
    data: { title: "Review QiLife shell and decide first real module", notes: "Do not overbuild. Pick the next slice." }
  });

  await createRecord({
    entity_key: "person",
    title: "Lisa",
    data: { name: "Lisa", role: "Mom", relationship: "family", tags: ["care", "family"] }
  });

  await createRecord({
    entity_key: "home_item",
    title: "Smoke detector",
    status: "bought",
    data: { name: "Smoke detector", category: "safety", status: "bought", location: "house" }
  });
}
