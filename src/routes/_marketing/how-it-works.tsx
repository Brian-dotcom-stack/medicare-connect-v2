import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_marketing/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Medicare Connect" },
      { name: "description", content: "From onboarding to daily operations in four simple steps." },
      { property: "og:title", content: "How it works — Medicare Connect" },
      { property: "og:description", content: "From onboarding to daily operations in four simple steps." },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  { n: "01", title: "Onboard your organisation", body: "Create your workspace, add your team, and set up roles in under 15 minutes." },
  { n: "02", title: "Add clients & schedules", body: "Import client records and build your first weekly rota with drag-friendly shifts." },
  { n: "03", title: "Run daily operations", body: "Staff record medications, log incidents, and see today's priorities on a live dashboard." },
  { n: "04", title: "Stay compliant", body: "Audit logs, training reminders and reports keep you inspection-ready year-round." },
];

function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">How it works</h1>
      <p className="mt-3 text-muted-foreground">A calm, guided path from sign-up to daily use.</p>
      <ol className="mt-12 space-y-8">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-6 rounded-xl border border-border bg-card p-6">
            <div className="text-3xl font-bold text-primary">{s.n}</div>
            <div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex justify-center">
        <Button asChild size="lg"><Link to="/demo">Book a demo</Link></Button>
      </div>
    </div>
  );
}
