import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg, logAudit } from "@/lib/data/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Incident = Database["public"]["Tables"]["incidents"]["Row"];
type Severity = Database["public"]["Enums"]["incident_severity"];
type Status = Database["public"]["Enums"]["incident_status"];

export const Route = createFileRoute("/_app/incidents")({
  head: () => ({ meta: [{ title: "Incidents — Medicare Connect" }] }),
  component: IncidentsPage,
});

const sevVariant: Record<Severity, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary", medium: "secondary", high: "destructive", critical: "destructive",
};

function IncidentsPage() {
  const { activeOrg, userId, name: actorName } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);

  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents", orgId],
    queryFn: async () => (await supabase.from("incidents").select("*").eq("org_id", orgId).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", orgId],
    queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? [],
  });
  const { data: staff = [] } = useQuery({
    queryKey: ["staff", orgId],
    queryFn: async () => (await supabase.from("staff").select("*").eq("org_id", orgId).order("name")).data ?? [],
  });

  const upsert = useMutation({
    mutationFn: async (input: { id?: string; title: string; description: string; severity: Severity; status: Status; client_id: string | null; reported_by: string | null }) => {
      if (input.id) {
        const { error } = await supabase.from("incidents").update({
          title: input.title, description: input.description, severity: input.severity,
          status: input.status, client_id: input.client_id, reported_by: input.reported_by,
        }).eq("id", input.id);
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "incident.update", input.title);
      } else {
        const { error } = await supabase.from("incidents").insert({
          org_id: orgId, title: input.title, description: input.description, severity: input.severity,
          status: input.status, client_id: input.client_id, reported_by: input.reported_by,
        });
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "incident.create", input.title);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["incidents", orgId] }); toast.success(editing ? "Incident updated" : "Incident logged"); setOpen(false); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const del = useMutation({
    mutationFn: async (row: Incident) => {
      const { error } = await supabase.from("incidents").delete().eq("id", row.id);
      if (error) throw error;
      await logAudit(orgId, userId, actorName, "incident.delete", row.title);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["incidents", orgId] }); toast.success("Incident deleted"); },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const c = String(f.get("client_id"));
    const r = String(f.get("reported_by"));
    upsert.mutate({
      id: editing?.id,
      title: String(f.get("title")),
      description: String(f.get("description") ?? ""),
      severity: String(f.get("severity")) as Severity,
      status: String(f.get("status")) as Status,
      client_id: c === "none" ? null : c,
      reported_by: r === "none" ? null : r,
    });
  }

  return (
    <>
      <PageHeader
        title="Incidents"
        description="Log and track incidents, accidents and safeguarding concerns."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Log incident</Button>}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Client</TableHead>
              <TableHead>Severity</TableHead><TableHead>Status</TableHead>
              <TableHead>Reported</TableHead><TableHead className="w-10" />
            </TableRow></TableHeader>
            <TableBody>
              {incidents.map((i) => {
                const cn = clients.find((c) => c.id === i.client_id)?.name ?? "—";
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.title}</TableCell>
                    <TableCell>{cn}</TableCell>
                    <TableCell><Badge variant={sevVariant[i.severity]} className="capitalize">{i.severity}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditing(i); setOpen(true); }}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm("Delete incident?")) del.mutate(i); }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {incidents.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No incidents logged.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit incident" : "Log incident"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3" key={editing?.id ?? "new"}>
            <div><Label>Title</Label><Input name="title" defaultValue={editing?.title} required /></div>
            <div><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} rows={4} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Severity</Label>
                <Select name="severity" defaultValue={editing?.severity ?? "low"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue={editing?.status ?? "open"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Client</Label>
              <Select name="client_id" defaultValue={editing?.client_id ?? "none"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reported by</Label>
              <Select name="reported_by" defaultValue={editing?.reported_by ?? "none"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button type="submit" disabled={upsert.isPending}>{editing ? "Save" : "Log"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
