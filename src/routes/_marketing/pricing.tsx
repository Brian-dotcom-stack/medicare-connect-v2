import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PLANS } from "@/lib/billing/plans";
import { createCheckoutSession } from "@/lib/billing.functions";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Starter, Growth & Enterprise | Medicare Connect" },
      {
        name: "description",
        content:
          "Simple per-user pricing for care providers. Starter £6, Growth £12, Enterprise custom. 14-day free trial, cancel anytime.",
      },
      { property: "og:title", content: "Pricing — Medicare Connect" },
      {
        property: "og:description",
        content:
          "Starter, Growth and Enterprise plans for care services. 14-day free trial, no card required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Every organisation starts on a 14-day trial with full access. No card is needed to begin.",
  },
  {
    q: "Can I change plan later?",
    a: "Yes — upgrade, downgrade or cancel at any time from Settings → Billing via the self-serve portal.",
  },
  {
    q: "What happens if a payment fails?",
    a: "You keep access during a 7-day grace period while you update your card, so care delivery is never interrupted.",
  },
  {
    q: "Do you support multiple organisations?",
    a: "Yes. Each organisation is billed separately and data is isolated at the database layer.",
  },
];

function PricingPage() {
  const navigate = useNavigate();
  const goCheckout = useServerFn(createCheckoutSession);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSelect = async (planId: string, priceId: string | null) => {
    if (!priceId) {
      navigate({ to: "/contact" });
      return;
    }
    if (!userId) {
      navigate({ to: "/register" });
      return;
    }

    setBusy(planId);
    try {
      const { data: memberships, error } = await supabase
        .from("org_memberships")
        .select("org_id, role")
        .eq("user_id", userId)
        .limit(1);
      if (error) throw error;

      const membership = memberships?.[0];
      if (!membership) {
        toast.info("Create your organisation first, then pick a plan.");
        navigate({ to: "/onboarding" });
        return;
      }
      if (membership.role !== "admin") {
        toast.error("Only an organisation admin can start a subscription.");
        return;
      }

      const { url } = await goCheckout({
        data: {
          orgId: membership.org_id,
          priceId,
          origin: window.location.origin,
        },
      });
      if (url) window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 via-background to-background" />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-success" />
            14-day free trial — no credit card required
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            Simple, honest pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Pay per active user, per month. No setup fees, no minimum term, and
            you can cancel whenever you like.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-3xl border bg-card p-8 ${
                p.highlight
                  ? "border-primary shadow-2xl ring-1 ring-primary/20 md:-my-4 md:py-12"
                  : "border-border shadow-sm"
              }`}
            >
              {p.highlight && (
                <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Most popular
                </div>
              )}
              <div className="text-xl font-semibold tracking-tight">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold tracking-tight md:text-6xl">
                  {p.price}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {p.period}
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {p.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-base">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Button
                  className="w-full"
                  size="lg"
                  variant={p.highlight ? "default" : "outline"}
                  disabled={busy === p.id}
                  onClick={() => handleSelect(p.id, p.priceId)}
                >
                  {busy === p.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting…
                    </>
                  ) : p.priceId ? (
                    <>
                      {userId ? "Subscribe" : "Start free trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Contact sales"
                  )}
                </Button>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  {p.priceId
                    ? "Secure checkout via Stripe"
                    : "Tailored quote within one working day"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-sm text-muted-foreground">
          Prices in GBP, excluding VAT. Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline">
            Sign in
          </Link>{" "}
          to manage your subscription.
        </p>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-20 md:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            Pricing questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
            Everything you need to know about plans, billing, and switching.
          </p>
          <dl className="mt-12 grid gap-6 md:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <dt className="text-lg font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/demo">Book a demo instead</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
