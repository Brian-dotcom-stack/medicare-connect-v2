import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg, logAudit } from "@/lib/data/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type Medication = Database["public"]["Tables"]["medications"]["Row"];
type MarStatus = Database["public"]["Enums"]["mar_status"];

export const Route = createFileRoute("/_app/medications")({
  head: () => ({ meta: [{ title: "Medications — Medicare Connect" }] }),
  component: MedsPage,
});

const statusColors: Record<MarStatus, string> = {
  given: "bg-success text-success-foreground",
  missed: "bg-destructive text-destructive-foreground",
  refused: "bg-warning text-warning-foreground",
  pending: "bg-muted text-foreground",
};
const cycle: MarStatus[] = ["pending", "given", "refused", "missed"];

function MedsPage() {
  const { activeOrg, userId, name: actorName } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);

  const { data: meds = [] } = useQuery({
    queryKey: ["medications", orgId],
    queryFn: async () => (await supabase.from("medications").select("*").eq("org_id", orgId).order("name")).data ?? [],
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", orgId],
    queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? [],
  });
  const { data: mar = [] } = useQuery({
    queryKey: ["mar", orgId, today],
    queryFn: async () => (await supabase.from("mar_entries").select("*").eq("org_id", orgId).eq("date", today)).data ?? [],
  });

  const toggle = useMutation({
    mutationFn: async ({ medId, slot }: { medId: string; slot: string }) => {
      const existing = mar.find((m) => m.medication_id === medId && m.slot === slot);
      const next = cycle[(cycle.indexOf(existing?.status ?? "pending") + 1) % cycle.length];
      if (existing) {
        const { error } = await supabase.from("mar_entries").update({ status: next }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("mar_entries").insert({ org_id: orgId, medication_id: medId, date: today, slot, status: next });
        if (error) throw error;
      }
      await logAudit(orgId, userId, actorName, `mar.${next}`, `${medId} @ ${slot}`);
      return next;
    },
    onSuccess: (next) => { qc.invalidateQueries({ queryKey: ["mar", orgId, today] }); toast.success(`Marked ${next}`); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const upsert = useMutation({
    mutationFn: async (input: { id?: string; client_id: string; name: string; dose: string; schedule: string[]; notes: string }) => {
      if (input.id) {
        const { error } = await supabase.from("medications").update({
          client_id: input.client_id, name: input.name, dose: input.dose, schedule: input.schedule, notes: input.notes,
        }).eq("id", input.id);
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "medication.update", input.name);
      } else {
        const { error } = await supabase.from("medications").insert({
          org_id: orgId, client_id: input.client_id, name: input.name, dose: input.dose, schedule: input.schedule, notes: input.notes,
        });
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "medication.create", input.name);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["medications", orgId] }); toast.success(editing ? "Medication updated" : "Medication added"); setOpen(false); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const del = useMutation({
    mutationFn: async (row: Medication) => {
      const { error } = await supabase.from("medications").delete().eq("id", row.id);
      if (error) throw error;
      await logAudit(orgId, userId, actorName, "medication.delete", row.name);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["medications", orgId] }); toast.success("Medication removed"); },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const schedule = String(f.get("schedule") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    upsert.mutate({
      id: editing?.id,
      client_id: String(f.get("client_id")),
      name: String(f.get("name")),
      dose: String(f.get("dose") ?? ""),
      schedule,
      notes: String(f.get("notes") ?? ""),
    });
  }

  return (
    <>
      <PageHeader
        title="Medications"
        description="Today's medication administration record (MAR)."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add medication</Button>}
      />
      <div className="space-y-4">
        {clients.map((c) => {
          const clientMeds = meds.filter((m) => m.client_id === c.id);
          if (clientMeds.length === 0) return null;
          return (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="mb-3 font-semibold">{c.name}</div>
                <div className="space-y-2">
                  {clientMeds.map((m) => (
                    <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium">{m.name} <span className="text-muted-foreground">— {m.dose}</span></div>
                        {m.notes && <div className="text-xs text-muted-foreground">{m.notes}</div>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {m.schedule.map((slot) => {
                          const entry = mar.find((x) => x.medication_id === m.id && x.slot === slot);
                          const status = entry?.status ?? "pending";
                          return (
                            <button key={slot} onClick={() => toggle.mutate({ medId: m.id, slot })}
                              className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs transition hover:bg-muted">
                              <span>{slot}</span>
                              <Badge className={`capitalize ${statusColors[status]}`}>{status}</Badge>
                            </button>
                          );
                        })}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditing(m); setOpen(true); }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm(`Delete ${m.name}?`)) del.mutate(m); }}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {meds.length === 0 && (
          <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No medications yet. Add one to start the MAR.</CardContent></Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit medication" : "Add medication"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3" key={editing?.id ?? "new"}>
            <div>
              <Label>Client</Label>
              <Select name="client_id" defaultValue={editing?.client_id ?? clients[0]?.id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
            <div><Label>Dose</Label><Input name="dose" defaultValue={editing?.dose} placeholder="e.g. 10mg" /></div>
            <div><Label>Schedule</Label><Input name="schedule" defaultValue={editing?.schedule.join(", ")} placeholder="08:00, 20:00" /></div>
            <div><Label>Notes</Label><Textarea name="notes" defaultValue={editing?.notes} rows={2} /></div>
            <DialogFooter><Button type="submit" disabled={upsert.isPending}>{editing ? "Save" : "Add"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
