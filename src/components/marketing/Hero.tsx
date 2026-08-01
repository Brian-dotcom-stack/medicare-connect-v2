import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  CalendarClock,
  PillBottle,
  ClipboardList,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-background" />
      <div className="absolute -right-20 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              14-day free trial — no credit card required
            </div>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Care management that actually feels calm.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Medicare Connect brings rotas, medications, incidents and compliance into one quiet workspace — so your team spends less time on admin and more time with the people they support.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                <Link to="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/demo">Book a demo</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Cancel anytime. Built for domiciliary and residential care.
            </p>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
      <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground">Medicare Connect</div>
            <div className="text-xs text-muted-foreground">Live overview</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MiniCard
            icon={CalendarClock}
            label="Rotas"
            value="8 shifts today"
            tone="primary"
          />
          <MiniCard
            icon={PillBottle}
            label="Medications"
            value="12 / 14 given"
            tone="success"
          />
          <MiniCard
            icon={ClipboardList}
            label="Incidents"
            value="0 open"
            tone="warning"
          />
          <MiniCard
            icon={Users}
            label="Staff on duty"
            value="6 active"
            tone="accent"
          />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            Compliance check complete
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            All MAR entries signed and audit trail up to date.
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning" | "accent";
}) {
  const toneStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/20 text-accent-foreground",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition hover:shadow-md">
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${toneStyles[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
