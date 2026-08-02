import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { i as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as logAudit, r as useOrg } from "./context-CLdJq7VD.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D3LK1kDF.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rotas-DyNrlExW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RotasPage() {
	const { activeOrg, userId, name: actorName } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const days = (0, import_react.useMemo)(() => {
		const arr = [];
		const today = /* @__PURE__ */ new Date();
		for (let i = 0; i < 7; i++) {
			const d = new Date(today);
			d.setDate(d.getDate() + i);
			arr.push(d.toISOString().slice(0, 10));
		}
		return arr;
	}, []);
	const { data: staff = [] } = useQuery({
		queryKey: ["staff", orgId],
		queryFn: async () => (await supabase.from("staff").select("*").eq("org_id", orgId).eq("active", true).order("name")).data ?? []
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients", orgId],
		queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? []
	});
	const { data: shifts = [] } = useQuery({
		queryKey: [
			"shifts",
			orgId,
			days[0],
			days[6]
		],
		queryFn: async () => (await supabase.from("shifts").select("*").eq("org_id", orgId).gte("date", days[0]).lte("date", days[6])).data ?? []
	});
	const upsert = useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { error } = await supabase.from("shifts").update({
					staff_id: input.staff_id,
					client_id: input.client_id,
					date: input.date,
					start_time: input.start_time,
					end_time: input.end_time
				}).eq("id", input.id);
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "shift.update", `${input.date} ${input.start_time}`);
			} else {
				const { error } = await supabase.from("shifts").insert({
					org_id: orgId,
					staff_id: input.staff_id,
					client_id: input.client_id,
					date: input.date,
					start_time: input.start_time,
					end_time: input.end_time,
					status: "scheduled"
				});
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "shift.create", `${input.date} ${input.start_time}`);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["shifts", orgId] });
			toast.success(editing ? "Shift updated" : "Shift added");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const del = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("shifts").delete().eq("id", row.id);
			if (error) throw error;
			await logAudit(orgId, userId, actorName, "shift.delete", `${row.date} ${row.start_time}`);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["shifts", orgId] });
			toast.success("Shift removed");
		}
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		upsert.mutate({
			id: editing?.id,
			staff_id: String(f.get("staff_id")),
			client_id: String(f.get("client_id")),
			date: String(f.get("date")),
			start_time: String(f.get("start_time")),
			end_time: String(f.get("end_time"))
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Rotas",
			description: "Weekly schedule across your team.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add shift"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "overflow-x-auto p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] border-separate border-spacing-0 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "sticky left-0 z-10 border-b border-r border-border bg-card p-3 text-left font-medium",
					children: "Staff"
				}), days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					className: "border-b border-border p-3 text-left font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: new Date(d).toLocaleDateString(void 0, { weekday: "short" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: new Date(d).toLocaleDateString(void 0, {
							month: "short",
							day: "numeric"
						})
					})]
				}, d))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "sticky left-0 z-10 border-b border-r border-border bg-card p-3 font-medium",
					children: s.name
				}), days.map((d) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "min-w-[140px] border-b border-border p-2 align-top",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: shifts.filter((sh) => sh.staff_id === s.id && sh.date === d).map((sh) => {
								const client = clients.find((c) => c.id === sh.client_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "block w-full text-left",
										onClick: () => {
											setEditing(sh);
											setOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-medium",
											children: [
												sh.start_time.slice(0, 5),
												"–",
												sh.end_time.slice(0, 5)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate",
											children: client?.name ?? "—"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "absolute right-1 top-1 opacity-0 group-hover:opacity-100",
										onClick: () => {
											if (confirm("Delete shift?")) del.mutate(sh);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									})]
								}, sh.id);
							})
						})
					}, d);
				})] }, s.id)), staff.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "py-8 text-center text-sm text-muted-foreground",
					children: "Add staff first."
				}) })] })]
			})
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit shift" : "Add shift" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Staff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "staff_id",
						defaultValue: editing?.staff_id ?? staff[0]?.id,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name
						}, s.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "client_id",
						defaultValue: editing?.client_id ?? clients[0]?.id,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						name: "date",
						defaultValue: editing?.date ?? days[0],
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							name: "start_time",
							defaultValue: editing?.start_time?.slice(0, 5) ?? "09:00",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							name: "end_time",
							defaultValue: editing?.end_time?.slice(0, 5) ?? "12:00",
							required: true
						})] })]
					}),
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
export { RotasPage as component };
