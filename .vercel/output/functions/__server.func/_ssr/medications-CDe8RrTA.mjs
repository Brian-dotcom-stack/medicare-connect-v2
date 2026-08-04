import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { u as Plus, x as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as logAudit, r as useOrg } from "./context-DztgDiE_.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D3LK1kDF.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/medications-CDe8RrTA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusColors = {
	given: "bg-success text-success-foreground",
	missed: "bg-destructive text-destructive-foreground",
	refused: "bg-warning text-warning-foreground",
	pending: "bg-muted text-foreground"
};
var cycle = [
	"pending",
	"given",
	"refused",
	"missed"
];
function MedsPage() {
	const { activeOrg, userId, name: actorName } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: meds = [] } = useQuery({
		queryKey: ["medications", orgId],
		queryFn: async () => (await supabase.from("medications").select("*").eq("org_id", orgId).order("name")).data ?? []
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients", orgId],
		queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? []
	});
	const { data: mar = [] } = useQuery({
		queryKey: [
			"mar",
			orgId,
			today
		],
		queryFn: async () => (await supabase.from("mar_entries").select("*").eq("org_id", orgId).eq("date", today)).data ?? []
	});
	const toggle = useMutation({
		mutationFn: async ({ medId, slot }) => {
			const existing = mar.find((m) => m.medication_id === medId && m.slot === slot);
			const next = cycle[(cycle.indexOf(existing?.status ?? "pending") + 1) % cycle.length];
			if (existing) {
				const { error } = await supabase.from("mar_entries").update({ status: next }).eq("id", existing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("mar_entries").insert({
					org_id: orgId,
					medication_id: medId,
					date: today,
					slot,
					status: next
				});
				if (error) throw error;
			}
			await logAudit(orgId, userId, actorName, `mar.${next}`, `${medId} @ ${slot}`);
			return next;
		},
		onSuccess: (next) => {
			qc.invalidateQueries({ queryKey: [
				"mar",
				orgId,
				today
			] });
			toast.success(`Marked ${next}`);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const upsert = useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { error } = await supabase.from("medications").update({
					client_id: input.client_id,
					name: input.name,
					dose: input.dose,
					schedule: input.schedule,
					notes: input.notes
				}).eq("id", input.id);
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "medication.update", input.name);
			} else {
				const { error } = await supabase.from("medications").insert({
					org_id: orgId,
					client_id: input.client_id,
					name: input.name,
					dose: input.dose,
					schedule: input.schedule,
					notes: input.notes
				});
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "medication.create", input.name);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["medications", orgId] });
			toast.success(editing ? "Medication updated" : "Medication added");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const del = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("medications").delete().eq("id", row.id);
			if (error) throw error;
			await logAudit(orgId, userId, actorName, "medication.delete", row.name);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["medications", orgId] });
			toast.success("Medication removed");
		}
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const schedule = String(f.get("schedule") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
		upsert.mutate({
			id: editing?.id,
			client_id: String(f.get("client_id")),
			name: String(f.get("name")),
			dose: String(f.get("dose") ?? ""),
			schedule,
			notes: String(f.get("notes") ?? "")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Medications",
			description: "Today's medication administration record (MAR).",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add medication"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [clients.map((c) => {
				const clientMeds = meds.filter((m) => m.client_id === c.id);
				if (clientMeds.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 font-semibold",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: clientMeds.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium",
									children: [
										m.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["— ", m.dose]
										})
									]
								}), m.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: m.notes
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [m.schedule.map((slot) => {
									const status = mar.find((x) => x.medication_id === m.id && x.slot === slot)?.status ?? "pending";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => toggle.mutate({
											medId: m.id,
											slot
										}),
										className: "inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs transition hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: slot }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `capitalize ${statusColors[status]}`,
											children: status
										})]
									}, slot);
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-7 w-7",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											setEditing(m);
											setOpen(true);
										},
										children: "Edit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "text-destructive",
										onClick: () => {
											if (confirm(`Delete ${m.name}?`)) del.mutate(m);
										},
										children: "Delete"
									})]
								})] })]
							})]
						}, m.id))
					})]
				}) }, c.id);
			}), meds.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "No medications yet. Add one to start the MAR."
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit medication" : "Add medication" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "client_id",
						defaultValue: editing?.client_id ?? clients[0]?.id,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						defaultValue: editing?.name,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Dose" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "dose",
						defaultValue: editing?.dose,
						placeholder: "e.g. 10mg"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Schedule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "schedule",
						defaultValue: editing?.schedule.join(", "),
						placeholder: "08:00, 20:00"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "notes",
						defaultValue: editing?.notes,
						rows: 2
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: upsert.isPending,
						children: editing ? "Save" : "Add"
					}) })
				]
			}, editing?.id ?? "new")] })
		})
	] });
}
//#endregion
export { MedsPage as component };
