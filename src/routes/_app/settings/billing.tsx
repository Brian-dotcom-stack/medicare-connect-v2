import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useOrg } from "@/lib/data/context";
import { supabase } from "@/integrations/supabase/client";
import { PLANS, accessState, statusLabel } from "@/lib/billing/plans";
import { createCheckoutSession, createPortalSession, syncSubscription } from "@/lib/billing.functions";

export const Route = createFileRoute("/_app/settings/billing")({
  validateSearch: (s: Record<string, unknown>) => ({ checkout: (s.checkout as string) || undefined }),
  component: BillingPage,
});

interface BillingOrg {
  plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

function BillingPage() {
  const { activeOrg } = useOrg();
  const orgId = activeOrg?.id;
  const isAdmin = activeOrg?.role === "admin";
  const qc = useQueryClient();
  const { checkout } = useSearch({ from: "/_app/settings/billing" });
  const [busy, setBusy] = useState<string | null>(null);

  const goCheckout = useServerFn(createCheckoutSession);
  const goPortal = useServerFn(createPortalSession);
  const doSync = useServerFn(syncSubscription);

  const { data: billing, isLoading } = useQuery({
    queryKey: ["billing", orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<BillingOrg | null> => {
      const { data, error } = await supabase
        .from("organisations")
        .select("plan, subscription_status, trial_ends_at, current_period_end, stripe_customer_id")
        .eq("id", orgId!)
        .maybeSingle();
      if (error) throw error;
      return data as BillingOrg | null;
    },
  });

  const refresh = async (silent = false) => {
    if (!orgId) return;
    try {
      setBusy("sync");
      await doSync({ data: { orgId } });
      await qc.invalidateQueries({ queryKey: ["billing", orgId] });
      if (!silent) toast.success("Subscription status refreshed");
    } catch (e) {
      if (!silent) toast.error(e instanceof Error ? e.message : "Could not refresh status");
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    if (checkout === "success") {
      toast.success("Subscription started — thanks!");
      void refresh(true);
    } else if (checkout === "cancelled") {
      toast.info("Checkout cancelled — no changes made.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const subscribe = async (priceId: string) => {
    if (!orgId) return;
    try {
      setBusy(priceId);
      const { url } = await goCheckout({
        data: { orgId, priceId, origin: window.location.origin },
      });
      window.open(url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
    } finally {
      setBusy(null);
    }
  };

  const openPortal = async () => {
    if (!orgId) return;
    try {
      setBusy("portal");
      const { url } = await goPortal({ data: { orgId, origin: window.location.origin } });
      window.open(url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open billing portal");
    } finally {
      setBusy(null);
    }
  };

  const access = billing
    ? accessState(billing)
    : { active: true, reason: "", daysLeft: null as number | null };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your plan, payment method and invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold capitalize">
                {isLoading ? "Loading…" : `${billing?.plan ?? "starter"} plan`}
              </div>
              <div className="text-sm text-muted-foreground">{access.reason}</div>
              {billing?.current_period_end && (
                <div className="text-xs text-muted-foreground">
                  Renews {new Date(billing.current_period_end).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={access.active ? "outline" : "destructive"}>
                {statusLabel(billing?.subscription_status ?? "trialing")}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => refresh()} disabled={busy === "sync"}>
                {busy === "sync" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {!access.active && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              Your access has lapsed. Choose a plan below to restore full functionality.
            </div>
          )}

          {isAdmin && billing?.stripe_customer_id && (
            <Button variant="outline" onClick={openPortal} disabled={busy === "portal"}>
              {busy === "portal" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Manage billing
            </Button>
          )}
          {!isAdmin && (
            <p className="text-sm text-muted-foreground">
              Only organisation admins can change the subscription.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = billing?.plan === p.id;
          return (
            <Card key={p.id} className={current ? "ring-1 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {p.name}
                  {p.highlight && <Badge>Popular</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{p.price}</div>
                <div className="text-xs text-muted-foreground">{p.period}</div>
                <ul className="mt-4 space-y-1 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                {p.priceId ? (
                  <Button
                    className="mt-6 w-full"
                    variant={current ? "outline" : "default"}
                    disabled={!isAdmin || busy === p.priceId || (current && access.active)}
                    onClick={() => subscribe(p.priceId!)}
                  >
                    {busy === p.priceId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {current && access.active ? "Current plan" : "Choose plan"}
                  </Button>
                ) : (
                  <Button className="mt-6 w-full" variant="outline" asChild>
                    <a href="/contact">Contact sales</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments run in Stripe test mode for this demo workspace — no real charges are made.
      </p>
    </div>
  );
}
