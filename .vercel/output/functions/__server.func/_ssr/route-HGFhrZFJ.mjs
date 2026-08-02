import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { f as Outlet, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-HGFhrZFJ.js
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	{
		to: "/settings/profile",
		label: "Profile"
	},
	{
		to: "/settings/organisation",
		label: "Organisation"
	},
	{
		to: "/settings/team",
		label: "Team"
	},
	{
		to: "/settings/billing",
		label: "Billing"
	}
];
function SettingsLayout() {
	const loc = useLocation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Manage your workspace."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-1 border-b border-border",
			children: tabs.map((t) => {
				const active = loc.pathname === t.to;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: t.to,
					className: `border-b-2 px-4 py-2 text-sm transition ${active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: t.label
				}, t.to);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	] });
}
//#endregion
export { SettingsLayout as component };
