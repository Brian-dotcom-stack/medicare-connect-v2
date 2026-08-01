import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg, logAudit } from "@/lib/data/context";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Staff = Database["public"]["Tables"]["staff"]["Row"];
type Role = Database["public"]["Enums"]["app_role"];

export const Route = createFileRoute("/_app/staff")({
  head: () => ({ meta: [{ title: "Staff — Medicare Connect" }] }),
  component: StaffPage,
});

function StaffPage() {
  const { activeOrg, userId, name: actorName } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const { data: staff = [] } = useQuery({
    queryKey: ["staff", orgId],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").eq("org_id", orgId).order("name");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: { id?: string; name: string; email: string; role: Role; job_title: string; phone: string; active: boolean }) => {
      if (input.id) {
        const { error } = await supabase.from("staff").update({
          name: input.name, email: input.email, role: input.role, job_title: input.job_title, phone: input.phone, active: input.active,
        }).eq("id", input.id);
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "staff.update", input.name);
      } else {
        const { error } = await supabase.from("staff").insert({
          org_id: orgId, name: input.name, email: input.email, role: input.role, job_title: input.job_title, phone: input.phone, active: input.active,
        });
        if (error) throw error;
        await logAudit(orgId, userId, actorName, "staff.create", input.name);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff", orgId] });
      toast.success(editing ? "Staff updated" : "Staff added");
      setOpen(false); setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const del = useMutation({
    mutationFn: async (row: Staff) => {
      const { error } = await supabase.from("staff").delete().eq("id", row.id);
      if (error) throw error;
      await logAudit(orgId, userId, actorName, "staff.delete", row.name);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["staff", orgId] }); toast.success("Staff removed"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    upsert.mutate({
      id: editing?.id,
      name: String(f.get("name")),
      email: String(f.get("email")),
      role: String(f.get("role")) as Role,
      job_title: String(f.get("job_title")),
      phone: String(f.get("phone") ?? ""),
      active: f.get("active") === "on",
    });
  }

  function openAdd() { setEditing(null); setOpen(true); }
  function openEdit(row: Staff) { setEditing(row); setOpen(true); }

  return (
    <>
      <PageHeader
        title="Staff"
        description="Manage your team, their roles and contact details."
        actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add staff</Button>}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Job title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{s.role}</Badge></TableCell>
                  <TableCell>{s.job_title}</TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell>{s.active
                    ? <Badge className="bg-success text-success-foreground">Active</Badge>
                    : <Badge variant="outline">Inactive</Badge>}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(s)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          if (confirm(`Remove ${s.name}?`)) del.mutate(s);
                        }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {staff.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No staff yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit staff member" : "Add staff member"}</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3" key={editing?.id ?? "new"}>
            <div><Label>Full name</Label><Input name="name" defaultValue={editing?.name} required /></div>
            <div><Label>Email</Label><Input name="email" type="email" defaultValue={editing?.email} required /></div>
            <div><Label>Job title</Label><Input name="job_title" defaultValue={editing?.job_title} required /></div>
            <div><Label>Phone</Label><Input name="phone" defaultValue={editing?.phone} /></div>
            <div>
              <Label>Role</Label>
              <Select name="role" defaultValue={editing?.role ?? "staff"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="role_hidden" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} /> Active
            </label>
            <DialogFooter><Button type="submit" disabled={upsert.isPending}>{editing ? "Save" : "Add"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
