import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useLocation, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, E as ChevronsUpDown, M as Bell, _ as LayoutDashboard, c as ScrollText, d as PillBottle, h as LogOut, j as CalendarClock, n as Users, r as TriangleAlert, s as Settings, v as HeartPulse, y as HeartHandshake } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { r as useOrg, t as OrgProvider } from "./context-CLdJq7VD.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DGROJ0dc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DemoBanner() {
	return null;
}
var nav = [
	{
		to: "/overview",
		label: "Overview",
		icon: LayoutDashboard
	},
	{
		to: "/staff",
		label: "Staff",
		icon: Users
	},
	{
		to: "/clients",
		label: "Clients",
		icon: HeartHandshake
	},
	{
		to: "/rotas",
		label: "Rotas",
		icon: CalendarClock
	},
	{
		to: "/incidents",
		label: "Incidents",
		icon: TriangleAlert
	},
	{
		to: "/medications",
		label: "Medications",
		icon: PillBottle
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/audit",
		label: "Audit logs",
		icon: ScrollText
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ children }) {
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
	function switchOrg(id) {
		setActiveOrgId(id);
		router.invalidate();
	}
	if (!activeOrg) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center gap-2 border-b border-sidebar-border px-5 font-bold text-sidebar-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-4 w-4" })
					}), "Medicare Connect"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-sidebar-border p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex w-full items-center justify-between rounded-md border border-sidebar-border bg-card px-3 py-2 text-left text-sm hover:bg-sidebar-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: activeOrg.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs capitalize text-muted-foreground",
									children: [activeOrg.plan, " plan"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "h-4 w-4 text-muted-foreground" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "start",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Switch organisation" }),
							orgs.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => switchOrg(o.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: o.name
								}), o.id === activeOrg.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })]
							}, o.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/onboarding",
									children: "+ Create organisation"
								})
							})
						]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-0.5 p-3",
					children: nav.map((item) => {
						const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-sidebar-border p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-md px-2 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
								children: name.slice(0, 1).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "capitalize",
									children: activeOrg.role
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: handleLogout,
								"aria-label": "Sign out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							})
						]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl p-6",
				children
			})]
		})]
	});
}
function AppLayout() {
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (!mounted) return;
			const u = data.session?.user;
			if (u) setSession({
				userId: u.id,
				email: u.email ?? "",
				name: u.user_metadata?.name ?? u.email?.split("@")[0] ?? "User"
			});
		})();
		return () => {
			mounted = false;
		};
	}, []);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Loading workspace…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgProvider, {
		session,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgGate, {})
	});
}
function OrgGate() {
	const { orgs, activeOrg, isLoading } = useOrg();
	const navigate = useNavigate();
	const path = typeof window !== "undefined" ? window.location.pathname : "";
	(0, import_react.useEffect)(() => {
		if (!isLoading && orgs.length === 0 && path !== "/onboarding") navigate({ to: "/onboarding" });
	}, [
		orgs.length,
		isLoading,
		path,
		navigate
	]);
	if (isLoading || orgs.length === 0 || !activeOrg) {
		if (orgs.length === 0 && path === "/onboarding") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center bg-muted/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Loading workspace…"
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };
