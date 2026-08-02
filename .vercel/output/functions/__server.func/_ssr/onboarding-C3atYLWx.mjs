import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { r as useOrg } from "./context-CLdJq7VD.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as useServerFn, r as provisionOrgCustomer } from "./billing.functions-CIujGvYd.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-C3atYLWx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
/**
* Seeds a new organisation with fictional demo data so dashboards render meaningfully.
* All names, addresses and details are entirely fictional — safe for public demos.
*/
async function seedFictionalOrgData(orgId) {
	const { data: staffRows, error: sErr } = await supabase.from("staff").insert([
		{
			org_id: orgId,
			name: "Amelia Hart",
			email: "amelia.hart@example.org",
			role: "manager",
			job_title: "Care Manager",
			phone: "+44 20 7946 0100",
			active: true
		},
		{
			org_id: orgId,
			name: "Jordan Reyes",
			email: "jordan.reyes@example.org",
			role: "staff",
			job_title: "Senior Carer",
			phone: "+44 20 7946 0101",
			active: true
		},
		{
			org_id: orgId,
			name: "Priya Shah",
			email: "priya.shah@example.org",
			role: "staff",
			job_title: "Care Assistant",
			phone: "+44 20 7946 0102",
			active: true
		},
		{
			org_id: orgId,
			name: "Marcus Bell",
			email: "marcus.bell@example.org",
			role: "staff",
			job_title: "Care Assistant",
			phone: "+44 20 7946 0103",
			active: true
		}
	]).select();
	if (sErr) throw sErr;
	const { data: clientRows, error: cErr } = await supabase.from("clients").insert([
		{
			org_id: orgId,
			name: "Edith Whitmore",
			date_of_birth: "1938-04-12",
			address: "14 Rose Cottage Lane, Willowbrook",
			key_contact: "Daughter — Sarah Whitmore",
			care_level: "high",
			notes: "Prefers morning visits. Enjoys classical music."
		},
		{
			org_id: orgId,
			name: "Harold Pemberton",
			date_of_birth: "1942-11-03",
			address: "27 Old Mill Road, Northlake",
			key_contact: "Son — David Pemberton",
			care_level: "medium",
			notes: "Diabetic. Insulin twice daily."
		},
		{
			org_id: orgId,
			name: "Beatrice Nkomo",
			date_of_birth: "1945-07-21",
			address: "8 Chestnut Avenue, Willowbrook",
			key_contact: "Nephew — Chidi Nkomo",
			care_level: "low",
			notes: "Independent, needs light domestic support."
		},
		{
			org_id: orgId,
			name: "Frank Osei",
			date_of_birth: "1936-01-30",
			address: "3 Meadow View, Northlake",
			key_contact: "Wife — Grace Osei",
			care_level: "high",
			notes: "Mobility support required."
		}
	]).select();
	if (cErr) throw cErr;
	const staff = staffRows ?? [];
	const clients = clientRows ?? [];
	if (staff.length === 0 || clients.length === 0) return;
	const today = /* @__PURE__ */ new Date();
	const shifts = [];
	for (let d = 0; d < 7; d++) {
		const day = new Date(today);
		day.setDate(day.getDate() + d);
		const date = day.toISOString().slice(0, 10);
		clients.forEach((c, i) => {
			const st = staff[(i + d) % staff.length];
			shifts.push({
				org_id: orgId,
				staff_id: st.id,
				client_id: c.id,
				date,
				start_time: i % 2 === 0 ? "08:00" : "14:00",
				end_time: i % 2 === 0 ? "11:00" : "17:00",
				status: "scheduled"
			});
		});
	}
	await supabase.from("shifts").insert(shifts);
	const meds = [];
	meds.push({
		org_id: orgId,
		client_id: clients[0].id,
		name: "Donepezil",
		dose: "10mg",
		schedule: ["08:00"],
		notes: "Take with breakfast."
	});
	meds.push({
		org_id: orgId,
		client_id: clients[1].id,
		name: "Metformin",
		dose: "500mg",
		schedule: ["08:00", "20:00"],
		notes: "With meals."
	});
	meds.push({
		org_id: orgId,
		client_id: clients[1].id,
		name: "Insulin (short-acting)",
		dose: "6 units",
		schedule: ["08:00", "18:00"],
		notes: "Check blood glucose first."
	});
	meds.push({
		org_id: orgId,
		client_id: clients[3].id,
		name: "Amlodipine",
		dose: "5mg",
		schedule: ["08:00"],
		notes: ""
	});
	await supabase.from("medications").insert(meds);
	await supabase.from("incidents").insert([{
		org_id: orgId,
		client_id: clients[0].id,
		reported_by: staff[1].id,
		severity: "medium",
		title: "Minor fall in hallway",
		description: "Resident stumbled near the hallway rug. No injuries, GP notified.",
		status: "investigating"
	}, {
		org_id: orgId,
		client_id: clients[3].id,
		reported_by: staff[2].id,
		severity: "low",
		title: "Missed medication window",
		description: "Amlodipine given 40 minutes late due to visit delay. Documented.",
		status: "resolved"
	}]);
}
function OnboardingPage() {
	const navigate = useNavigate();
	const { userId, refresh, setActiveOrgId } = useOrg();
	const provisionCustomer = useServerFn(provisionOrgCustomer);
	const [name, setName] = (0, import_react.useState)("");
	const [seed, setSeed] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function createOrg(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setBusy(true);
		try {
			const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}-${Math.random().toString(36).slice(2, 6)}`;
			const { data: org, error } = await supabase.from("organisations").insert({
				name: name.trim(),
				slug,
				plan: "starter",
				created_by: userId
			}).select().single();
			if (error) throw error;
			if (org) try {
				await provisionCustomer({ data: { orgId: org.id } });
			} catch {}
			if (seed && org) await seedFictionalOrgData(org.id);
			await refresh();
			if (org) setActiveOrgId(org.id);
			toast.success("Organisation ready");
			navigate({ to: "/overview" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create organisation");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Set up your organisation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: createOrg,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Give your workspace a name. You can invite team members from Settings afterwards."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "orgName",
					children: "Organisation name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "orgName",
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true,
					autoFocus: true,
					placeholder: "e.g. Willowbrook Care Group"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: seed,
						onCheckedChange: (v) => setSeed(!!v)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "Load fictional demo data"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: "Adds a small set of fictional staff, clients, rotas, medications and incidents so you can explore."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Creating…" : "Create organisation"
				})
			]
		}) })] })
	});
}
//#endregion
export { OnboardingPage as component };
