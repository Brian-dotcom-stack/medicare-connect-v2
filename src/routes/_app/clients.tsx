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

type Client = Database["public"]["Tables"]["clients"]["Row"];
type CareLevel = Database["public"]["Enums"]["care_level"];

export const Route = createFileRoute("/_app/clients")({
  head: () => ({ meta: [{ title: "Clients — Medicare Connect" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const { activeOrg, userId, name: actorName } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", orgId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("org_id", orgId).order("name");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: Partial<Client> & { name: string; care_level: CareLevel }) => {
      if (editing) {
        const { error } = await supabase.from("clients").update({
          name: input.name, date_of_birth: input.date_of_birth || null, address: input.address ?? "",
          key_contact: input.key_contact ?? "", care_level: input.care_level, notes: input.notes ?? "",
        }).eq("id", editing.id);
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "client.update", input.name);
      } else {
        const { error } = await supabase.from("clients").insert({
          org_id: orgId, name: input.name, date_of_birth: input.date_of_birth || null,
          address: input.address ?? "", key_contact: input.key_contact ?? "",
          care_level: input.care_level, notes: input.notes ?? "",
        });
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "client.create", input.name);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients", orgId] });
      toast.success(editing ? "Client updated" : "Client added");
      setOpen(false); setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const del = useMutation({
    mutationFn: async (row: Client) => {
      const { error } = await supabase.from("clients").delete().eq("id", row.id);
      if (error) throw error;
      await logAudit(orgId, userId, actorName, "client.delete", row.name);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clients", orgId] }); toast.success("Client removed"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    upsert.mutate({
      name: String(f.get("name")),
      date_of_birth: String(f.get("date_of_birth") ?? ""),
      address: String(f.get("address") ?? ""),
      key_contact: String(f.get("key_contact") ?? ""),
      care_level: String(f.get("care_level")) as CareLevel,
      notes: String(f.get("notes") ?? ""),
    });
  }

  return (
    <>
      <PageHeader
        title="Clients"
        description="People receiving care and support."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add client</Button>}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>DOB</TableHead>
              <TableHead>Care level</TableHead><TableHead>Key contact</TableHead>
              <TableHead>Address</TableHead><TableHead className="w-10" />
            </TableRow></TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.date_of_birth ?? "—"}</TableCell>
                  <TableCell><Badge className="capitalize" variant={c.care_level === "high" ? "destructive" : "secondary"}>{c.care_level}</Badge></TableCell>
                  <TableCell>{c.key_contact || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{c.address || "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditing(c); setOpen(true); }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm(`Remove ${c.name}?`)) del.mutate(c); }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No clients yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit client" : "Add client"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3" key={editing?.id ?? "new"}>
            <div><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
            <div><Label>Date of birth</Label><Input name="date_of_birth" type="date" defaultValue={editing?.date_of_birth ?? ""} /></div>
            <div><Label>Address</Label><Input name="address" defaultValue={editing?.address} /></div>
            <div><Label>Key contact</Label><Input name="key_contact" defaultValue={editing?.key_contact} /></div>
            <div>
              <Label>Care level</Label>
              <Select name="care_level" defaultValue={editing?.care_level ?? "low"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea name="notes" defaultValue={editing?.notes} rows={3} /></div>
            <DialogFooter><Button type="submit" disabled={upsert.isPending}>{editing ? "Save" : "Add"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
