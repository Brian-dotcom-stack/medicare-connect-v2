import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { accessState, statusLabel } from "@/lib/billing/plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/settings/organisation")({
  component: OrgSettingsPage,
});

function OrgSettingsPage() {
  const { activeOrg, refresh } = useOrg();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  useEffect(() => { if (activeOrg) { setName(activeOrg.name); setSlug(activeOrg.slug); } }, [activeOrg]);

  const save = useMutation({
    mutationFn: async () => {
      if (!activeOrg) return;
      const { error } = await supabase.from("organisations").update({ name, slug }).eq("id", activeOrg.id);
      if (error) throw error;
    },
    onSuccess: async () => { await refresh(); qc.invalidateQueries(); toast.success("Organisation updated"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (!activeOrg) return null;
  const access = accessState(activeOrg);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Organisation details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="max-w-md space-y-4">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
            <div><Label>Plan</Label><Input value={activeOrg.plan} readOnly className="capitalize" /></div>
            <Button type="submit" disabled={save.isPending}>Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={access.active ? "outline" : "destructive"}>
                {statusLabel(activeOrg.subscription_status)}
              </Badge>
              <span className="text-sm capitalize text-muted-foreground">{activeOrg.plan} plan</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{access.reason}</div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/settings/billing" search={{ checkout: undefined }}>Manage billing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
