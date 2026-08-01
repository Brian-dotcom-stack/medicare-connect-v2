import type { Role } from "./mock/types";

const matrix: Record<Role, string[]> = {
  admin: [
    "staff.manage",
    "clients.manage",
    "rotas.manage",
    "incidents.manage",
    "medications.manage",
    "settings.manage",
    "billing.manage",
    "audit.view",
  ],
  manager: [
    "staff.manage",
    "clients.manage",
    "rotas.manage",
    "incidents.manage",
    "medications.manage",
    "audit.view",
  ],
  staff: ["clients.view", "rotas.view", "incidents.create", "medications.record"],
};

export function can(role: Role | null | undefined, action: string): boolean {
  if (!role) return false;
  return matrix[role]?.includes(action) ?? false;
}
