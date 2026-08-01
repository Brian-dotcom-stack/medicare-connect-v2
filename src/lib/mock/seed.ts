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

// All names below are fictional placeholders.
export const seedUsers: User[] = [
  {
    id: "u_demo",
    email: "demo@medicareconnect.test",
    name: "Demo Admin",
    emailVerified: true,
    memberships: [
      { orgId: "org_willowbrook", role: "admin" },
      { orgId: "org_northlake", role: "manager" },
    ],
  },
];

export const seedOrgs: Organisation[] = [
  {
    id: "org_willowbrook",
    name: "Willowbrook Care Group",
    slug: "willowbrook",
    plan: "growth",
    createdAt: "2025-01-14T09:00:00Z",
  },
  {
    id: "org_northlake",
    name: "Northlake Domiciliary",
    slug: "northlake",
    plan: "starter",
    createdAt: "2025-03-02T09:00:00Z",
  },
];

export const seedStaff: StaffMember[] = [
  { id: "s1", orgId: "org_willowbrook", name: "Ada Fernsby", email: "ada.f@willowbrook.test", role: "admin", jobTitle: "Registered Manager", phone: "+44 7000 000001", active: true },
  { id: "s2", orgId: "org_willowbrook", name: "Marcus Whitgrove", email: "marcus.w@willowbrook.test", role: "manager", jobTitle: "Care Coordinator", phone: "+44 7000 000002", active: true },
  { id: "s3", orgId: "org_willowbrook", name: "Priya Ellingham", email: "priya.e@willowbrook.test", role: "staff", jobTitle: "Senior Carer", phone: "+44 7000 000003", active: true },
  { id: "s4", orgId: "org_willowbrook", name: "Jonah Rickerby", email: "jonah.r@willowbrook.test", role: "staff", jobTitle: "Carer", phone: "+44 7000 000004", active: true },
  { id: "s5", orgId: "org_willowbrook", name: "Elowen Trask", email: "elowen.t@willowbrook.test", role: "staff", jobTitle: "Carer", phone: "+44 7000 000005", active: false },
  { id: "s6", orgId: "org_northlake", name: "Rowan Kestrelby", email: "rowan.k@northlake.test", role: "manager", jobTitle: "Service Lead", phone: "+44 7000 000006", active: true },
  { id: "s7", orgId: "org_northlake", name: "Halcyon Marish", email: "halcyon.m@northlake.test", role: "staff", jobTitle: "Support Worker", phone: "+44 7000 000007", active: true },
];

export const seedClients: Client[] = [
  { id: "c1", orgId: "org_willowbrook", name: "Bertram Ashcombe", dateOfBirth: "1942-06-11", address: "12 Larch Lane, Fictionville", keyContact: "Miriam Ashcombe (daughter)", careLevel: "high", notes: "Requires mobility aid; hearing impaired." },
  { id: "c2", orgId: "org_willowbrook", name: "Delphine Corrow", dateOfBirth: "1938-02-24", address: "4 Beechwood Court, Fictionville", keyContact: "Terence Corrow (son)", careLevel: "medium", notes: "Type 2 diabetes; low-sodium diet." },
  { id: "c3", orgId: "org_willowbrook", name: "Silas Penhaligon", dateOfBirth: "1951-11-03", address: "27 Ivy Terrace, Fictionville", keyContact: "Nora Penhaligon (spouse)", careLevel: "low", notes: "Independent; social visits only." },
  { id: "c4", orgId: "org_willowbrook", name: "Wren Alderby", dateOfBirth: "1946-08-19", address: "9 Millbrook Rise, Fictionville", keyContact: "Casper Alderby (son)", careLevel: "medium", notes: "Early-stage dementia; prompts required." },
  { id: "c5", orgId: "org_northlake", name: "Oswin Bramwick", dateOfBirth: "1940-04-30", address: "3 Kestrel Way, Northlake", keyContact: "Ivy Bramwick (daughter)", careLevel: "high", notes: "Post-stroke recovery." },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return iso(d);
};

export const seedShifts: Shift[] = [
  { id: "sh1", orgId: "org_willowbrook", staffId: "s3", clientId: "c1", date: day(0), start: "08:00", end: "12:00", status: "scheduled" },
  { id: "sh2", orgId: "org_willowbrook", staffId: "s4", clientId: "c2", date: day(0), start: "09:00", end: "13:00", status: "scheduled" },
  { id: "sh3", orgId: "org_willowbrook", staffId: "s3", clientId: "c4", date: day(1), start: "07:30", end: "11:00", status: "scheduled" },
  { id: "sh4", orgId: "org_willowbrook", staffId: "s4", clientId: "c1", date: day(1), start: "14:00", end: "18:00", status: "scheduled" },
  { id: "sh5", orgId: "org_willowbrook", staffId: "s5", clientId: "c3", date: day(2), start: "10:00", end: "12:00", status: "scheduled" },
  { id: "sh6", orgId: "org_willowbrook", staffId: "s3", clientId: "c2", date: day(3), start: "08:00", end: "12:00", status: "scheduled" },
  { id: "sh7", orgId: "org_northlake", staffId: "s7", clientId: "c5", date: day(0), start: "09:00", end: "15:00", status: "scheduled" },
];

export const seedIncidents: Incident[] = [
  { id: "i1", orgId: "org_willowbrook", clientId: "c1", reportedBy: "s3", severity: "medium", title: "Minor fall in kitchen", description: "Client slipped near sink. No injury observed. Mobility aid retrieved.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), status: "investigating" },
  { id: "i2", orgId: "org_willowbrook", clientId: "c2", reportedBy: "s4", severity: "low", title: "Missed lunch dose", description: "Client declined lunchtime medication. Follow-up scheduled.", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), status: "resolved" },
  { id: "i3", orgId: "org_willowbrook", clientId: "c4", reportedBy: "s3", severity: "high", title: "Disorientation episode", description: "Client became confused during evening visit. Family contacted.", createdAt: new Date(Date.now() - 86400000).toISOString(), status: "open" },
  { id: "i4", orgId: "org_northlake", clientId: "c5", reportedBy: "s7", severity: "critical", title: "Suspected TIA symptoms", description: "Speech slurred for ~3 minutes. Emergency services called; stable.", createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), status: "resolved" },
];

export const seedMedications: Medication[] = [
  { id: "m1", orgId: "org_willowbrook", clientId: "c1", name: "Amlodipine", dose: "5mg", schedule: ["08:00"], notes: "With breakfast." },
  { id: "m2", orgId: "org_willowbrook", clientId: "c1", name: "Paracetamol", dose: "500mg", schedule: ["12:00", "20:00"], notes: "PRN." },
  { id: "m3", orgId: "org_willowbrook", clientId: "c2", name: "Metformin", dose: "500mg", schedule: ["08:00", "20:00"], notes: "With meals." },
  { id: "m4", orgId: "org_willowbrook", clientId: "c4", name: "Donepezil", dose: "10mg", schedule: ["20:00"], notes: "Evening dose." },
];

export const seedMar: MarEntry[] = [
  { id: "mar1", orgId: "org_willowbrook", medicationId: "m1", date: day(0), slot: "08:00", status: "given", by: "s3" },
  { id: "mar2", orgId: "org_willowbrook", medicationId: "m3", date: day(0), slot: "08:00", status: "given", by: "s4" },
  { id: "mar3", orgId: "org_willowbrook", medicationId: "m3", date: day(0), slot: "20:00", status: "pending" },
  { id: "mar4", orgId: "org_willowbrook", medicationId: "m4", date: day(0), slot: "20:00", status: "pending" },
];

export const seedNotifications: Notification[] = [
  { id: "n1", orgId: "org_willowbrook", userId: "u_demo", title: "New incident reported", body: "Priya Ellingham logged a high-severity incident for Wren Alderby.", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: "n2", orgId: "org_willowbrook", userId: "u_demo", title: "Rota published", body: "This week's rota has been published to all staff.", createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), read: false },
  { id: "n3", orgId: "org_willowbrook", userId: "u_demo", title: "Compliance reminder", body: "3 staff members have training expiring in the next 30 days.", createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
];

export const seedAudit: AuditEvent[] = [
  { id: "a1", orgId: "org_willowbrook", actor: "Demo Admin", action: "org.settings.update", target: "Willowbrook Care Group", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "a2", orgId: "org_willowbrook", actor: "Marcus Whitgrove", action: "rota.publish", target: "Week of " + day(0), createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "a3", orgId: "org_willowbrook", actor: "Priya Ellingham", action: "incident.create", target: "Wren Alderby", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "a4", orgId: "org_willowbrook", actor: "Demo Admin", action: "staff.invite", target: "new.carer@willowbrook.test", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];
