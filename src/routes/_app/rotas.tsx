import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg, logAudit } from "@/lib/data/context";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];

export const Route = createFileRoute("/_app/rotas")({
  head: () => ({ meta: [{ title: "Rotas — Medicare Connect" }] }),
  component: RotasPage,
});

function RotasPage() {
  const { activeOrg, userId, name: actorName } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);

  const days = useMemo(() => {
    const arr: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) { const d = new Date(today); d.setDate(d.getDate() + i); arr.push(d.toISOString().slice(0, 10)); }
    return arr;
  }, []);

  const { data: staff = [] } = useQuery({
    queryKey: ["staff", orgId],
    queryFn: async () => (await supabase.from("staff").select("*").eq("org_id", orgId).eq("active", true).order("name")).data ?? [],
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients", orgId],
    queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? [],
  });
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts", orgId, days[0], days[6]],
    queryFn: async () => (await supabase.from("shifts").select("*").eq("org_id", orgId).gte("date", days[0]).lte("date", days[6])).data ?? [],
  });

  const upsert = useMutation({
    mutationFn: async (input: { id?: string; staff_id: string; client_id: string; date: string; start_time: string; end_time: string }) => {
      if (input.id) {
        const { error } = await supabase.from("shifts").update({
          staff_id: input.staff_id, client_id: input.client_id, date: input.date, start_time: input.start_time, end_time: input.end_time,
        }).eq("id", input.id);
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "shift.update", `${input.date} ${input.start_time}`);
      } else {
        const { error } = await supabase.from("shifts").insert({
          org_id: orgId, staff_id: input.staff_id, client_id: input.client_id, date: input.date,
          start_time: input.start_time, end_time: input.end_time, status: "scheduled",
        });
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "shift.create", `${input.date} ${input.start_time}`);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shifts", orgId] }); toast.success(editing ? "Shift updated" : "Shift added"); setOpen(false); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const del = useMutation({
    mutationFn: async (row: Shift) => {
      const { error } = await supabase.from("shifts").delete().eq("id", row.id);
      if (error) throw error;
      await logAudit(orgId, userId, actorName, "shift.delete", `${row.date} ${row.start_time}`);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shifts", orgId] }); toast.success("Shift removed"); },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    upsert.mutate({
      id: editing?.id,
      staff_id: String(f.get("staff_id")),
      client_id: String(f.get("client_id")),
      date: String(f.get("date")),
      start_time: String(f.get("start_time")),
      end_time: String(f.get("end_time")),
    });
  }

  return (
    <>
      <PageHeader
        title="Rotas"
        description="Weekly schedule across your team."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add shift</Button>}
      />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-border bg-card p-3 text-left font-medium">Staff</th>
                {days.map((d) => (
                  <th key={d} className="border-b border-border p-3 text-left font-medium">
                    <div>{new Date(d).toLocaleDateString(undefined, { weekday: "short" })}</div>
                    <div className="text-xs text-muted-foreground">{new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="sticky left-0 z-10 border-b border-r border-border bg-card p-3 font-medium">{s.name}</td>
                  {days.map((d) => {
                    const cell = shifts.filter((sh) => sh.staff_id === s.id && sh.date === d);
                    return (
                      <td key={d} className="min-w-[140px] border-b border-border p-2 align-top">
                        <div className="space-y-1">
                          {cell.map((sh) => {
                            const client = clients.find((c) => c.id === sh.client_id);
                            return (
                              <div key={sh.id} className="group relative rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
                                <button className="block w-full text-left" onClick={() => { setEditing(sh); setOpen(true); }}>
                                  <div className="font-medium">{sh.start_time.slice(0,5)}–{sh.end_time.slice(0,5)}</div>
                                  <div className="truncate">{client?.name ?? "—"}</div>
                                </button>
                                <button className="absolute right-1 top-1 opacity-0 group-hover:opacity-100" onClick={() => { if (confirm("Delete shift?")) del.mutate(sh); }}>
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Add staff first.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit shift" : "Add shift"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3" key={editing?.id ?? "new"}>
            <div>
              <Label>Staff</Label>
              <Select name="staff_id" defaultValue={editing?.staff_id ?? staff[0]?.id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client</Label>
              <Select name="client_id" defaultValue={editing?.client_id ?? clients[0]?.id}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" name="date" defaultValue={editing?.date ?? days[0]} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start</Label><Input type="time" name="start_time" defaultValue={editing?.start_time?.slice(0,5) ?? "09:00"} required /></div>
              <div><Label>End</Label><Input type="time" name="end_time" defaultValue={editing?.end_time?.slice(0,5) ?? "12:00"} required /></div>
            </div>
            <DialogFooter><Button type="submit" disabled={upsert.isPending}>{editing ? "Save" : "Add"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
