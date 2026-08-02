import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/context-CLdJq7VD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORG_KEY = "mc:activeOrg:v1";
var OrgCtx = (0, import_react.createContext)(null);
function useOrg() {
	const v = (0, import_react.useContext)(OrgCtx);
	if (!v) throw new Error("useOrg must be used within OrgProvider");
	return v;
}
async function fetchOrgs(userId) {
	const { data, error } = await supabase.from("org_memberships").select("role, organisations(*)").eq("user_id", userId);
	if (error) throw error;
	return (data ?? []).map((m) => m.organisations ? {
		...m.organisations,
		role: m.role
	} : null).filter((x) => x !== null);
}
function OrgProvider({ session, children }) {
	const [activeOrgId, setActiveOrgIdState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(ORG_KEY);
	});
	const { data: orgs = [], refetch, isLoading } = useQuery({
		queryKey: ["memberships", session.userId],
		queryFn: () => fetchOrgs(session.userId)
	});
	(0, import_react.useEffect)(() => {
		if (orgs.length === 0) return;
		if (!activeOrgId || !orgs.some((o) => o.id === activeOrgId)) {
			const first = orgs[0].id;
			setActiveOrgIdState(first);
			localStorage.setItem(ORG_KEY, first);
		}
	}, [orgs, activeOrgId]);
	const setActiveOrgId = (id) => {
		setActiveOrgIdState(id);
		localStorage.setItem(ORG_KEY, id);
	};
	const activeOrg = (0, import_react.useMemo)(() => orgs.find((o) => o.id === activeOrgId) ?? null, [orgs, activeOrgId]);
	const value = {
		userId: session.userId,
		email: session.email,
		name: session.name,
		orgs,
		activeOrg,
		setActiveOrgId,
		refresh: async () => {
			await refetch();
		},
		isLoading
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgCtx.Provider, {
		value,
		children
	});
}
async function logAudit(orgId, actorId, actorName, action, target) {
	await supabase.from("audit_events").insert({
		org_id: orgId,
		actor_id: actorId,
		actor_name: actorName,
		action,
		target
	});
}
//#endregion
export { logAudit as n, useOrg as r, OrgProvider as t };
