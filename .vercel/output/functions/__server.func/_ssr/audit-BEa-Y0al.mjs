import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useOrg } from "./context-DztgDiE_.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-BEa-Y0al.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const { activeOrg } = useOrg();
	const orgId = activeOrg.id;
	const { data: events = [] } = useQuery({
		queryKey: ["audit", orgId],
		queryFn: async () => (await supabase.from("audit_events").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(200)).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Audit log",
		description: "Every meaningful action, timestamped."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "When" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Actor" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Action" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Target" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-muted-foreground",
				children: new Date(e.created_at).toLocaleString()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: e.actor_name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "rounded bg-muted px-1.5 py-0.5 text-xs",
				children: e.action
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: e.target })
		] }, e.id)), events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 4,
			className: "py-8 text-center text-sm text-muted-foreground",
			children: "No activity yet."
		}) })] })] })
	}) })] });
}
//#endregion
export { AuditPage as component };
