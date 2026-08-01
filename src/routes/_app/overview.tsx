import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, HeartHandshake, PillBottle, Users } from "lucide-react";

export const Route = createFileRoute("/_app/overview")({
  head: () => ({ meta: [{ title: "Overview — Medicare Connect" }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const { activeOrg } = useOrg();
  const orgId = activeOrg!.id;
  const today = new Date().toISOString().slice(0, 10);

  const { data } = useQuery({
    queryKey: ["overview", orgId, today],
    queryFn: async () => {
      const [staff, clients, shiftsToday, incidents, mar] = await Promise.all([
        supabase.from("staff").select("id", { count: "exact", head: true }).eq("org_id", orgId).eq("active", true),
        supabase.from("clients").select("id", { count: "exact", head: true }).eq("org_id", orgId),
        supabase.from("shifts").select("id", { count: "exact", head: true }).eq("org_id", orgId).eq("date", today),
        supabase.from("incidents").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(4),
        supabase.from("mar_entries").select("id", { count: "exact", head: true }).eq("org_id", orgId).eq("date", today).eq("status", "pending"),
      ]);
      const openCount = (await supabase.from("incidents").select("id", { count: "exact", head: true }).eq("org_id", orgId).neq("status", "resolved")).count ?? 0;
      return {
        staff: staff.count ?? 0,
        clients: clients.count ?? 0,
        shiftsToday: shiftsToday.count ?? 0,
        pendingMar: mar.count ?? 0,
        openIncidents: openCount,
        recentIncidents: incidents.data ?? [],
      };
    },
  });

  const stats = [
    { label: "Active staff", value: data?.staff ?? 0, icon: Users, href: "/staff" },
    { label: "Clients", value: data?.clients ?? 0, icon: HeartHandshake, href: "/clients" },
    { label: "Shifts today", value: data?.shiftsToday ?? 0, icon: CalendarClock, href: "/rotas" },
    { label: "Pending medications", value: data?.pendingMar ?? 0, icon: PillBottle, href: "/medications" },
  ] as const;

  return (
    <>
      <PageHeader title="Overview" description="Today's snapshot across your service." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link to={s.href} key={s.label}>
            <Card className="transition hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent incidents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(!data || data.recentIncidents.length === 0) && <p className="text-sm text-muted-foreground">No incidents to show.</p>}
            {data?.recentIncidents.map((i) => (
              <div key={i.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</div>
                </div>
                <Badge variant={i.severity === "critical" || i.severity === "high" ? "destructive" : "secondary"} className="capitalize">{i.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>What to do next</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Review <Link to="/incidents" className="text-primary hover:underline">{data?.openIncidents ?? 0} open incidents</Link>.</p>
            <p>• Complete <Link to="/medications" className="text-primary hover:underline">{data?.pendingMar ?? 0} pending medication records</Link>.</p>
            <p>• Publish next week's <Link to="/rotas" className="text-primary hover:underline">rota</Link>.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
