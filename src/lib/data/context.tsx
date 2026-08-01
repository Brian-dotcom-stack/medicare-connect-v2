import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Role = Database["public"]["Enums"]["app_role"];
export type Organisation = Database["public"]["Tables"]["organisations"]["Row"];

const ORG_KEY = "mc:activeOrg:v1";

interface OrgCtxValue {
  userId: string;
  email: string;
  name: string;
  orgs: (Organisation & { role: Role })[];
  activeOrg: (Organisation & { role: Role }) | null;
  setActiveOrgId: (id: string) => void;
  refresh: () => Promise<void>;
}

const OrgCtx = createContext<OrgCtxValue | null>(null);

export function useOrg(): OrgCtxValue {
  const v = useContext(OrgCtx);
  if (!v) throw new Error("useOrg must be used within OrgProvider");
  return v;
}

export function useMaybeOrg(): OrgCtxValue | null {
  return useContext(OrgCtx);
}

async function fetchOrgs(userId: string): Promise<(Organisation & { role: Role })[]> {
  const { data, error } = await supabase
    .from("org_memberships")
    .select("role, organisations(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? [])
    .map((m) => (m.organisations ? { ...(m.organisations as Organisation), role: m.role as Role } : null))
    .filter((x): x is Organisation & { role: Role } => x !== null);
}

export function OrgProvider({
  session,
  children,
}: {
  session: { userId: string; email: string; name: string };
  children: ReactNode;
}) {
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ORG_KEY);
  });

  const { data: orgs = [], refetch } = useQuery({
    queryKey: ["memberships", session.userId],
    queryFn: () => fetchOrgs(session.userId),
  });

  useEffect(() => {
    if (orgs.length === 0) return;
    if (!activeOrgId || !orgs.some((o) => o.id === activeOrgId)) {
      const first = orgs[0].id;
      setActiveOrgIdState(first);
      localStorage.setItem(ORG_KEY, first);
    }
  }, [orgs, activeOrgId]);

  const setActiveOrgId = (id: string) => {
    setActiveOrgIdState(id);
    localStorage.setItem(ORG_KEY, id);
  };

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === activeOrgId) ?? null,
    [orgs, activeOrgId],
  );

  const value: OrgCtxValue = {
    userId: session.userId,
    email: session.email,
    name: session.name,
    orgs,
    activeOrg,
    setActiveOrgId,
    refresh: async () => {
      await refetch();
    },
  };

  return <OrgCtx.Provider value={value}>{children}</OrgCtx.Provider>;
}

export async function logAudit(
  orgId: string,
  actorId: string,
  actorName: string,
  action: string,
  target: string,
) {
  await supabase.from("audit_events").insert({
    org_id: orgId,
    actor_id: actorId,
    actor_name: actorName,
    action,
    target,
  });
}
