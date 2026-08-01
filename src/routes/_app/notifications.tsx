import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Medicare Connect" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { activeOrg, userId } = useOrg();
  const orgId = activeOrg!.id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["notifications", orgId, userId],
    queryFn: async () => (await supabase.from("notifications").select("*").eq("org_id", orgId).eq("user_id", userId).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: members = [] } = useQuery({
    queryKey: ["memberships-full", orgId],
    queryFn: async () => (await supabase.from("org_memberships").select("user_id, role").eq("org_id", orgId)).data ?? [],
  });

  const markAll = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("org_id", orgId).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", orgId, userId] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", orgId, userId] }),
  });

  const send = useMutation({
    mutationFn: async (input: { title: string; body: string; target: "me" | "all" }) => {
      const targets = input.target === "me" ? [userId] : members.map((m) => m.user_id);
      const rows = targets.map((uid) => ({ org_id: orgId, user_id: uid, title: input.title, body: input.body }));
      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications", orgId, userId] }); toast.success("Notification sent"); setOpen(false); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    send.mutate({ title: String(f.get("title")), body: String(f.get("body") ?? ""), target: String(f.get("target")) as "me" | "all" });
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Alerts and reminders for your workspace."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => markAll.mutate()}>Mark all read</Button>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New</Button>
          </div>
        }
      />
      <div className="space-y-2">
        {items.map((n) => (
          <Card key={n.id}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`mt-1.5 h-2 w-2 rounded-full ${n.read ? "bg-border" : "bg-primary"}`} />
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.body}</div>
                <div className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => del.mutate(n.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No notifications.</CardContent></Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send notification</DialogTitle></DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3">
            <div><Label>Title</Label><Input name="title" required /></div>
            <div><Label>Message</Label><Textarea name="body" rows={3} /></div>
            <div>
              <Label>Send to</Label>
              <Select name="target" defaultValue="me">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="me">Just me</SelectItem>
                  <SelectItem value="all">Everyone in this organisation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button type="submit" disabled={send.isPending}>Send</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
