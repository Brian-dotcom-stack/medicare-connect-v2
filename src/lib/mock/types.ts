export type Role = "admin" | "manager" | "staff";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  memberships: { orgId: string; role: Role }[];
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "growth" | "enterprise";
  createdAt: string;
}

export interface StaffMember {
  id: string;
  orgId: string;
  name: string;
  email: string;
  role: Role;
  jobTitle: string;
  phone: string;
  active: boolean;
}

export interface Client {
  id: string;
  orgId: string;
  name: string;
  dateOfBirth: string;
  address: string;
  keyContact: string;
  careLevel: "low" | "medium" | "high";
  notes: string;
}

export interface Shift {
  id: string;
  orgId: string;
  staffId: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  status: "scheduled" | "completed" | "cancelled";
}

export interface Incident {
  id: string;
  orgId: string;
  clientId: string;
  reportedBy: string; // staffId
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  createdAt: string;
  status: "open" | "investigating" | "resolved";
}

export interface Medication {
  id: string;
  orgId: string;
  clientId: string;
  name: string;
  dose: string;
  schedule: string[]; // e.g. ["08:00", "20:00"]
  notes: string;
}

export interface MarEntry {
  id: string;
  orgId: string;
  medicationId: string;
  date: string;
  slot: string;
  status: "given" | "missed" | "refused" | "pending";
  by?: string;
}

export interface Notification {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AuditEvent {
  id: string;
  orgId: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}
