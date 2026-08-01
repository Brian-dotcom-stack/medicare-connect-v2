import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings/team")({
  component: TeamPage,
});

function TeamPage() {
  const { activeOrg } = useOrg();
  const orgId = activeOrg!.id;

  const { data: members = [] } = useQuery({
    queryKey: ["memberships-team", orgId],
    queryFn: async () => {
      const { data } = await supabase.from("org_memberships").select("role, user_id").eq("org_id", orgId);
      if (!data) return [];
      const ids = data.map((m) => m.user_id);
      const profiles = ids.length
        ? (await supabase.from("profiles").select("id, name, email").in("id", ids)).data ?? []
        : [];
      return data.map((m) => ({
        ...m,
        profile: profiles.find((p) => p.id === m.user_id) ?? null,
      }));
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Invite a team member</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); toast.info("Email invites are coming in the billing phase — for now, share your organisation link and add teammates as staff records."); }} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[240px]"><Label>Email</Label><Input type="email" placeholder="colleague@example.com" required /></div>
            <Button type="submit">Send invite</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Members</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.user_id}>
                  <TableCell className="font-medium">{m.profile?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.profile?.email ?? "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{m.role}</Badge></TableCell>
                </TableRow>
              ))}
              {members.length === 0 && (
                <TableRow><TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">No members yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
