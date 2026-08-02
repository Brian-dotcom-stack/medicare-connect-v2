import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-it-works-ucy_y2kZ.js
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		n: "01",
		title: "Onboard your organisation",
		body: "Create your workspace, add your team, and set up roles in under 15 minutes."
	},
	{
		n: "02",
		title: "Add clients & schedules",
		body: "Import client records and build your first weekly rota with drag-friendly shifts."
	},
	{
		n: "03",
		title: "Run daily operations",
		body: "Staff record medications, log incidents, and see today's priorities on a live dashboard."
	},
	{
		n: "04",
		title: "Stay compliant",
		body: "Audit logs, training reminders and reports keep you inspection-ready year-round."
	}
];
function HowItWorksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold tracking-tight",
				children: "How it works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "A calm, guided path from sign-up to daily use."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-12 space-y-8",
				children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-6 rounded-xl border border-border bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold text-primary",
						children: s.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: s.body
					})] })]
				}, s.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/demo",
						children: "Book a demo"
					})
				})
			})
		]
	});
}
//#endregion
export { HowItWorksPage as component };
