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
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D3LK1kDF.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/incidents-C70siLWI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sevVariant = {
	low: "secondary",
	medium: "secondary",
	high: "destructive",
	critical: "destructive"
};
function IncidentsPage() {
	const { activeOrg, userId, name: actorName } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: incidents = [] } = useQuery({
		queryKey: ["incidents", orgId],
		queryFn: async () => (await supabase.from("incidents").select("*").eq("org_id", orgId).order("created_at", { ascending: false })).data ?? []
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients", orgId],
		queryFn: async () => (await supabase.from("clients").select("*").eq("org_id", orgId).order("name")).data ?? []
	});
	const { data: staff = [] } = useQuery({
		queryKey: ["staff", orgId],
		queryFn: async () => (await supabase.from("staff").select("*").eq("org_id", orgId).order("name")).data ?? []
	});
	const upsert = useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { error } = await supabase.from("incidents").update({
					title: input.title,
					description: input.description,
					severity: input.severity,
					status: input.status,
					client_id: input.client_id,
					reported_by: input.reported_by
				}).eq("id", input.id);
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "incident.update", input.title);
			} else {
				const { error } = await supabase.from("incidents").insert({
					org_id: orgId,
					title: input.title,
					description: input.description,
					severity: input.severity,
					status: input.status,
					client_id: input.client_id,
					reported_by: input.reported_by
				});
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "incident.create", input.title);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["incidents", orgId] });
			toast.success(editing ? "Incident updated" : "Incident logged");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const del = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("incidents").delete().eq("id", row.id);
			if (error) throw error;
			await logAudit(orgId, userId, actorName, "incident.delete", row.title);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["incidents", orgId] });
			toast.success("Incident deleted");
		}
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const c = String(f.get("client_id"));
		const r = String(f.get("reported_by"));
		upsert.mutate({
			id: editing?.id,
			title: String(f.get("title")),
			description: String(f.get("description") ?? ""),
			severity: String(f.get("severity")),
			status: String(f.get("status")),
			client_id: c === "none" ? null : c,
			reported_by: r === "none" ? null : r
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Incidents",
			description: "Log and track incidents, accidents and safeguarding concerns.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Log incident"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Title" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Client" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Severity" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reported" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-10" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [incidents.map((i) => {
				const cn = clients.find((c) => c.id === i.client_id)?.name ?? "—";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: i.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: cn }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: sevVariant[i.severity],
						className: "capitalize",
						children: i.severity
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "capitalize",
						children: i.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-muted-foreground",
						children: new Date(i.created_at).toLocaleDateString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onClick: () => {
								setEditing(i);
								setOpen(true);
							},
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							className: "text-destructive",
							onClick: () => {
								if (confirm("Delete incident?")) del.mutate(i);
							},
							children: "Delete"
						})]
					})] }) })
				] }, i.id);
			}), incidents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "No incidents logged."
			}) })] })] })
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit incident" : "Log incident" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "title",
						defaultValue: editing?.title,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "description",
						defaultValue: editing?.description,
						rows: 4
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Severity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "severity",
							defaultValue: editing?.severity ?? "low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "low",
									children: "Low"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "medium",
									children: "Medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "high",
									children: "High"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "critical",
									children: "Critical"
								})
							] })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "status",
							defaultValue: editing?.status ?? "open",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "open",
									children: "Open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "investigating",
									children: "Investigating"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "resolved",
									children: "Resolved"
								})
							] })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "client_id",
						defaultValue: editing?.client_id ?? "none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "— None —"
						}), clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reported by" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "reported_by",
						defaultValue: editing?.reported_by ?? "none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "— None —"
						}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.name
						}, s.id))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: upsert.isPending,
						children: editing ? "Save" : "Log"
					}) })
				]
			}, editing?.id ?? "new")] })
		})
	] });
}
//#endregion
export { IncidentsPage as component };
