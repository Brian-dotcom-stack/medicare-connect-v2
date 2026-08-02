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
      // Keep the redirect target on the same origin only (no open redirect).
      const target = location.href.startsWith(window.location.origin)
        ? location.href
        : "/overview";
      throw redirect({ to: "/login", search: { redirect: target } });
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
  const { orgs, activeOrg, isLoading } = useOrg();
  const navigate = useNavigate();
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (!isLoading && orgs.length === 0 && path !== "/onboarding") {
      navigate({ to: "/onboarding" });
    }
  }, [orgs.length, isLoading, path, navigate]);

  // While memberships are loading, show a placeholder instead of rendering the
  // Outlet (which would crash on `activeOrg!.id`).
  if (isLoading || orgs.length === 0 || !activeOrg) {
    if (orgs.length === 0 && path === "/onboarding") {
      return <Outlet />;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

