import { Link, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, HeartHandshake, CalendarClock, AlertTriangle,
  PillBottle, Bell, Settings, ScrollText, HeartPulse, LogOut, ChevronsUpDown, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { DemoBanner } from "@/components/DemoBanner";
import { useOrg } from "@/lib/data/context";

const nav = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/staff", label: "Staff", icon: Users },
  { to: "/clients", label: "Clients", icon: HeartHandshake },
  { to: "/rotas", label: "Rotas", icon: CalendarClock },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
  { to: "/medications", label: "Medications", icon: PillBottle },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/audit", label: "Audit logs", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { name, orgs, activeOrg, setActiveOrgId } = useOrg();
  const router = useRouter();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") localStorage.removeItem("mc:activeOrg:v1");
    router.invalidate();
    navigate({ to: "/login" });
  }

  function switchOrg(id: string) {
    setActiveOrgId(id);
    router.invalidate();
  }

  if (!activeOrg) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5 font-bold text-sidebar-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="h-4 w-4" />
          </span>
          Medicare Connect
        </div>
        <div className="border-b border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-md border border-sidebar-border bg-card px-3 py-2 text-left text-sm hover:bg-sidebar-accent">
                <div className="min-w-0">
                  <div className="truncate font-medium">{activeOrg.name}</div>
                  <div className="text-xs capitalize text-muted-foreground">{activeOrg.plan} plan</div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch organisation</DropdownMenuLabel>
              {orgs.map((o) => (
                <DropdownMenuItem key={o.id} onClick={() => switchOrg(o.id)}>
                  <span className="flex-1">{o.name}</span>
                  {o.id === activeOrg.id && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/onboarding">+ Create organisation</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {nav.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{name}</div>
              <Badge variant="secondary" className="capitalize">{activeOrg.role}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <DemoBanner />
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </div>
    </div>
  );
}
