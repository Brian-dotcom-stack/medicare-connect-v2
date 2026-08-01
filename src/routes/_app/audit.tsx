import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/audit")({
  head: () => ({ meta: [{ title: "Audit log — Medicare Connect" }] }),
  component: AuditPage,
});

function AuditPage() {
  const { activeOrg } = useOrg();
  const orgId = activeOrg!.id;
  const { data: events = [] } = useQuery({
    queryKey: ["audit", orgId],
    queryFn: async () => (await supabase.from("audit_events").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(200)).data ?? [],
  });

  return (
    <>
      <PageHeader title="Audit log" description="Every meaningful action, timestamped." />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>When</TableHead><TableHead>Actor</TableHead>
              <TableHead>Action</TableHead><TableHead>Target</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground">{new Date(e.created_at).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{e.actor_name}</TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{e.action}</code></TableCell>
                  <TableCell>{e.target}</TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No activity yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
