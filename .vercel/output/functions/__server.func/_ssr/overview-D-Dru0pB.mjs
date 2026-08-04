import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as PillBottle, j as CalendarClock, n as Users, y as HeartHandshake } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useOrg } from "./context-DztgDiE_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overview-D-Dru0pB.js
var import_jsx_runtime = require_jsx_runtime();
function OverviewPage() {
	const { activeOrg } = useOrg();
	const orgId = activeOrg.id;
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data } = useQuery({
		queryKey: [
			"overview",
			orgId,
			today
		],
		queryFn: async () => {
			const [staff, clients, shiftsToday, incidents, mar] = await Promise.all([
				supabase.from("staff").select("id", {
					count: "exact",
					head: true
				}).eq("org_id", orgId).eq("active", true),
				supabase.from("clients").select("id", {
					count: "exact",
					head: true
				}).eq("org_id", orgId),
				supabase.from("shifts").select("id", {
					count: "exact",
					head: true
				}).eq("org_id", orgId).eq("date", today),
				supabase.from("incidents").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(4),
				supabase.from("mar_entries").select("id", {
					count: "exact",
					head: true
				}).eq("org_id", orgId).eq("date", today).eq("status", "pending")
			]);
			const openCount = (await supabase.from("incidents").select("id", {
				count: "exact",
				head: true
			}).eq("org_id", orgId).neq("status", "resolved")).count ?? 0;
			return {
				staff: staff.count ?? 0,
				clients: clients.count ?? 0,
				shiftsToday: shiftsToday.count ?? 0,
				pendingMar: mar.count ?? 0,
				openIncidents: openCount,
				recentIncidents: incidents.data ?? []
			};
		}
	});
	const stats = [
		{
			label: "Active staff",
			value: data?.staff ?? 0,
			icon: Users,
			href: "/staff"
		},
		{
			label: "Clients",
			value: data?.clients ?? 0,
			icon: HeartHandshake,
			href: "/clients"
		},
		{
			label: "Shifts today",
			value: data?.shiftsToday ?? 0,
			icon: CalendarClock,
			href: "/rotas"
		},
		{
			label: "Pending medications",
			value: data?.pendingMar ?? 0,
			icon: PillBottle,
			href: "/medications"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Overview",
			description: "Today's snapshot across your service."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: s.href,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "transition hover:shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-4 p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: s.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: s.label
						})] })]
					})
				})
			}, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent incidents" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [(!data || data.recentIncidents.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No incidents to show."
				}), data?.recentIncidents.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: i.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: new Date(i.created_at).toLocaleDateString()
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: i.severity === "critical" || i.severity === "high" ? "destructive" : "secondary",
						className: "capitalize",
						children: i.severity
					})]
				}, i.id))]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "What to do next" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"• Review ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/incidents",
							className: "text-primary hover:underline",
							children: [data?.openIncidents ?? 0, " open incidents"]
						}),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"• Complete ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/medications",
							className: "text-primary hover:underline",
							children: [data?.pendingMar ?? 0, " pending medication records"]
						}),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"• Publish next week's ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/rotas",
							className: "text-primary hover:underline",
							children: "rota"
						}),
						"."
					] })
				]
			})] })]
		})
	] });
}
//#endregion
export { OverviewPage as component };
