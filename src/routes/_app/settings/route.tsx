import { Outlet, createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Medicare Connect" }] }),
  component: SettingsLayout,
});

const tabs = [
  { to: "/settings/profile", label: "Profile" },
  { to: "/settings/organisation", label: "Organisation" },
  { to: "/settings/team", label: "Team" },
  { to: "/settings/billing", label: "Billing" },
] as const;

function SettingsLayout() {
  const loc = useLocation();
  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace." />
      <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => {
          const active = loc.pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`border-b-2 px-4 py-2 text-sm transition ${
                active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </>
  );
}
