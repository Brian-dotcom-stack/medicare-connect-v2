import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrgProvider, useOrg } from "@/lib/data/context";
import { AppShell } from "@/components/dashboard/AppShell";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: AppLayout,
});

interface Session {
  userId: string;
  email: string;
  name: string;
}

function AppLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const u = data.session?.user;
      if (u) {
        setSession({
          userId: u.id,
          email: u.email ?? "",
          name: (u.user_metadata?.name as string) ?? (u.email?.split("@")[0] ?? "User"),
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!session) {
    return <div className="p-8 text-sm text-muted-foreground">Loading workspace…</div>;
  }

  return (
    <OrgProvider session={session}>
      <OrgGate />
    </OrgProvider>
  );
}

function OrgGate() {
  const { orgs, activeOrg } = useOrg();
  const navigate = useNavigate();
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (orgs.length === 0 && path !== "/onboarding") {
      navigate({ to: "/onboarding" });
    }
  }, [orgs.length, path, navigate]);

  if (orgs.length === 0 || !activeOrg) {
    return <Outlet />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
