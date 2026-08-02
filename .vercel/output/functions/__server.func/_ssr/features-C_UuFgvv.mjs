import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, C as ClipboardList, N as ArrowRight, S as CreditCard, d as PillBottle, j as CalendarClock, n as Users, o as ShieldCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/features-C_UuFgvv.js
var import_jsx_runtime = require_jsx_runtime();
var pillars = [
	{
		icon: CalendarClock,
		eyebrow: "Rotas & shifts",
		title: "Publish a week's cover in minutes",
		body: "A seven-day grid puts every staff member, client and shift on one screen. Spot gaps before they happen, reassign in a click, and publish when you're happy.",
		points: [
			"Weekly grid with staff rows and day columns",
			"Assign shifts to a client and a carer together",
			"Draft, publish and edit without losing history",
			"Everything written to the audit trail"
		],
		tone: "primary"
	},
	{
		icon: Users,
		eyebrow: "Client records",
		title: "The whole picture, on one profile",
		body: "Care level, key contacts, address and clinical notes live together — so the person on shift has the context they need without hunting through paperwork.",
		points: [
			"Care levels from low to complex",
			"Next of kin and key contact details",
			"Notes visible to the right roles only",
			"Linked shifts, medications and incidents"
		],
		tone: "accent"
	},
	{
		icon: ClipboardList,
		eyebrow: "Incidents",
		title: "Report it properly, first time",
		body: "Structured, severity-tagged reports replace scribbled notes. Managers see what's open, what's escalating and what's been resolved — with dates that stand up to scrutiny.",
		points: [
			"Low, medium, high and critical severity tags",
			"Open, investigating and resolved states",
			"Reported-by and occurred-at captured automatically",
			"Filterable log for inspection prep"
		],
		tone: "warning"
	},
	{
		icon: PillBottle,
		eyebrow: "Medications (MAR)",
		title: "A digital MAR your team will actually use",
		body: "Scheduled doses per client with a single tap to record the outcome. Missed and refused doses stand out immediately instead of surfacing at the next audit.",
		points: [
			"Given, refused, missed and pending states",
			"Dose, route and schedule per medication",
			"Signed entries with timestamp and carer",
			"Immutable record behind every change"
		],
		tone: "success"
	},
	{
		icon: CreditCard,
		eyebrow: "Billing",
		title: "Subscriptions handled quietly in the background",
		body: "Start on a 14-day trial, upgrade when you're ready, and manage cards, invoices and cancellations from a self-serve portal. No emailing accounts to change a plan.",
		points: [
			"Starter and Growth plans, monthly",
			"14-day trial with a grace period on failed payments",
			"Self-serve billing portal for admins",
			"Live subscription status in organisation settings"
		],
		tone: "primary"
	},
	{
		icon: ShieldCheck,
		eyebrow: "Multi-tenant security",
		title: "One account, strictly separated organisations",
		body: "Every record is scoped to an organisation and enforced at the database layer, not just in the interface. Switch between services from the sidebar without data ever crossing over.",
		points: [
			"Row-level isolation per organisation",
			"Admin, Manager and Staff role permissions",
			"Organisation switcher for multi-service groups",
			"Append-only audit log of every action"
		],
		tone: "accent"
	}
];
var toneStyles = {
	primary: "bg-primary/10 text-primary",
	accent: "bg-accent/30 text-accent-foreground",
	warning: "bg-warning/10 text-warning",
	success: "bg-success/10 text-success"
};
function FeaturesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 via-background to-background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-success" }), "Built for domiciliary and residential care"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-balance text-4xl font-extrabold tracking-tight md:text-5xl",
						children: "Six things every care service needs — done properly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground",
						children: "Rotas, clients, incidents, medications, billing and watertight separation between organisations. No modules to bolt on, no spreadsheets to reconcile."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "shadow-lg shadow-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/register",
								children: ["Start free trial", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/demo",
								children: "Book a demo"
							})
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl space-y-16 px-4 py-20",
			children: pillars.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid items-center gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: i % 2 === 1 ? "lg:order-2" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mb-4 grid h-11 w-11 place-items-center rounded-xl ${toneStyles[p.tone]}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground",
							children: p.eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold tracking-tight md:text-3xl",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 leading-relaxed text-muted-foreground",
							children: p.body
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: i % 2 === 1 ? "lg:order-1 rounded-2xl border border-border bg-card p-6 shadow-sm" : "rounded-2xl border border-border bg-card p-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: p.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${toneStyles[p.tone]}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: point
							})]
						}, point))
					})
				})]
			}, p.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-4 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold",
								children: "See all six working together"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-xl opacity-90",
								children: "A 20-minute walkthrough using fictional demo data — nothing to install, nothing to sign."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/demo",
										children: ["Book your demo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/pricing",
										children: "View pricing"
									})
								})]
							})
						]
					})
				]
			})
		})
	] });
}
//#endregion
export { FeaturesPage as component };
