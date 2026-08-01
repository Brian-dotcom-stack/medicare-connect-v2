import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CalendarClock, ClipboardList, ShieldCheck, PillBottle, Users, Activity, ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "Medicare Connect — Care management, simplified" },
      { name: "description", content: "One platform for rotas, medications, incidents, and compliance across your care service." },
      { property: "og:title", content: "Medicare Connect" },
      { property: "og:description", content: "Care management for modern providers." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: CalendarClock, title: "Smart rotas", body: "Publish weekly schedules in minutes with drag-friendly shift planning." },
  { icon: PillBottle, title: "Medication workflows", body: "Digital MAR sheets with given/missed/refused states and full audit trail." },
  { icon: ClipboardList, title: "Incident reporting", body: "Structured, severity-tagged reports with follow-up and resolution states." },
  { icon: Users, title: "Client records", body: "Rich profiles with care levels, key contacts and clinical notes." },
  { icon: ShieldCheck, title: "Compliance ready", body: "Audit logs, role-based access and training reminders out of the box." },
  { icon: Activity, title: "Live dashboards", body: "See at a glance what needs attention across your organisation." },
];

function HomePage() {
  return (
    <>
      <Hero />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything your service needs</h2>
          <p className="mt-3 text-muted-foreground">Built for domiciliary and residential care.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition hover:shadow-md">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold">See it running in your service</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">A 20-minute walkthrough with your fictional data. No obligation.</p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link to="/demo">Book your demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

