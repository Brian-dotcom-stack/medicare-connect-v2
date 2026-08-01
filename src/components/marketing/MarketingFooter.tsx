import { Link } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </span>
            Medicare Connect
          </div>
          <p className="text-sm text-muted-foreground">
            Care management software for modern providers.
          </p>
        </div>
        <FooterCol title="Product" items={[["Features", "/features"], ["How it works", "/how-it-works"], ["Pricing", "/pricing"]]} />
        <FooterCol title="Company" items={[["Home", "/"], ["Book a demo", "/demo"], ["Contact", "/contact"]]} />
        <FooterCol title="Account" items={[["Sign in", "/login"], ["Create account", "/register"], ["Forgot password", "/forgot-password"]]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Medicare Connect — a fictional demo product.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {items.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
