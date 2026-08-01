import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/lib/data/context";
import { seedFictionalOrgData } from "@/lib/data/seed";
import { useServerFn } from "@tanstack/react-start";
import { provisionOrgCustomer } from "@/lib/billing.functions";

export const Route = createFileRoute("/_app/onboarding")({
  head: () => ({ meta: [{ title: "Set up your organisation — Medicare Connect" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { userId, refresh, setActiveOrgId } = useOrg();
  const provisionCustomer = useServerFn(provisionOrgCustomer);
  const [name, setName] = useState("");
  const [seed, setSeed] = useState(true);
  const [busy, setBusy] = useState(false);

  async function createOrg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}-${Math.random().toString(36).slice(2, 6)}`;
      const { data: org, error } = await supabase
        .from("organisations")
        .insert({ name: name.trim(), slug, plan: "starter", created_by: userId })
        .select()
        .single();
      if (error) throw error;
      if (org) {
        try {
          await provisionCustomer({ data: { orgId: org.id } });
        } catch {
          // Billing account can be created later from Settings → Billing.
        }
      }
      if (seed && org) {
        await seedFictionalOrgData(org.id);
      }
      await refresh();
      if (org) setActiveOrgId(org.id);
      toast.success("Organisation ready");
      navigate({ to: "/overview" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create organisation");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card>
        <CardHeader><CardTitle>Set up your organisation</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={createOrg} className="space-y-4">
            <p className="text-sm text-muted-foreground">Give your workspace a name. You can invite team members from Settings afterwards.</p>
            <div>
              <Label htmlFor="orgName">Organisation name</Label>
              <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder="e.g. Willowbrook Care Group" />
            </div>
            <label className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3 text-sm">
              <Checkbox checked={seed} onCheckedChange={(v) => setSeed(!!v)} />
              <span>
                <span className="font-medium">Load fictional demo data</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Adds a small set of fictional staff, clients, rotas, medications and incidents so you can explore.
                </span>
              </span>
            </label>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Creating…" : "Create organisation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
