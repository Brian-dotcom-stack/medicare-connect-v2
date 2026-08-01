// Simple localStorage-backed mock store. Client-only.
import {
  seedAudit,
  seedClients,
  seedIncidents,
  seedMar,
  seedMedications,
  seedNotifications,
  seedOrgs,
  seedShifts,
  seedStaff,
  seedUsers,
} from "./seed";
import type {
  AuditEvent,
  Client,
  Incident,
  MarEntry,
  Medication,
  Notification,
  Organisation,
  Shift,
  StaffMember,
  User,
} from "./types";

const KEY = "mc:store:v1";

interface Store {
  users: User[];
  orgs: Organisation[];
  staff: StaffMember[];
  clients: Client[];
  shifts: Shift[];
  incidents: Incident[];
  medications: Medication[];
  mar: MarEntry[];
  notifications: Notification[];
  audit: AuditEvent[];
}

const defaults = (): Store => ({
  users: seedUsers,
  orgs: seedOrgs,
  staff: seedStaff,
  clients: seedClients,
  shifts: seedShifts,
  incidents: seedIncidents,
  medications: seedMedications,
  mar: seedMar,
  notifications: seedNotifications,
  audit: seedAudit,
});

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadStore(): Store {
  if (!isBrowser()) return defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const d = defaults();
      localStorage.setItem(KEY, JSON.stringify(d));
      return d;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return defaults();
  }
}

export function saveStore(s: Store) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function mutate(fn: (s: Store) => void) {
  const s = loadStore();
  fn(s);
  saveStore(s);
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function resetStore() {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(defaults()));
}
