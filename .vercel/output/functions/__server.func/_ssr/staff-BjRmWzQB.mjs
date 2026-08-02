import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { u as Plus, x as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as logAudit, r as useOrg } from "./context-CLdJq7VD.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D3LK1kDF.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-BjRmWzQB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffPage() {
	const { activeOrg, userId, name: actorName } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: staff = [] } = useQuery({
		queryKey: ["staff", orgId],
		queryFn: async () => {
			const { data, error } = await supabase.from("staff").select("*").eq("org_id", orgId).order("name");
			if (error) throw error;
			return data;
		}
	});
	const upsert = useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { error } = await supabase.from("staff").update({
					name: input.name,
					email: input.email,
					role: input.role,
					job_title: input.job_title,
					phone: input.phone,
					active: input.active
				}).eq("id", input.id);
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "staff.update", input.name);
			} else {
				const { error } = await supabase.from("staff").insert({
					org_id: orgId,
					name: input.name,
					email: input.email,
					role: input.role,
					job_title: input.job_title,
					phone: input.phone,
					active: input.active
				});
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "staff.create", input.name);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff", orgId] });
			toast.success(editing ? "Staff updated" : "Staff added");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const del = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("staff").delete().eq("id", row.id);
			if (error) throw error;
			await logAudit(orgId, userId, actorName, "staff.delete", row.name);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff", orgId] });
			toast.success("Staff removed");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		upsert.mutate({
			id: editing?.id,
			name: String(f.get("name")),
			email: String(f.get("email")),
			role: String(f.get("role")),
			job_title: String(f.get("job_title")),
			phone: String(f.get("phone") ?? ""),
			active: f.get("active") === "on"
		});
	}
	function openAdd() {
		setEditing(null);
		setOpen(true);
	}
	function openEdit(row) {
		setEditing(row);
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Staff",
			description: "Manage your team, their roles and contact details.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: openAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add staff"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Job title" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-10" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "capitalize",
					children: s.role
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.job_title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: s.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "bg-success text-success-foreground",
					children: "Active"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: "Inactive"
				}) }),
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
						onClick: () => openEdit(s),
						children: "Edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
						className: "text-destructive",
						onClick: () => {
							if (confirm(`Remove ${s.name}?`)) del.mutate(s);
						},
						children: "Delete"
					})]
				})] }) })
			] }, s.id)), staff.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "No staff yet."
			}) })] })] })
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit staff member" : "Add staff member" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						defaultValue: editing?.name,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "email",
						type: "email",
						defaultValue: editing?.email,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Job title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "job_title",
						defaultValue: editing?.job_title,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "phone",
						defaultValue: editing?.phone
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "role",
							defaultValue: editing?.role ?? "staff",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "admin",
									children: "Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "manager",
									children: "Manager"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "staff",
									children: "Staff"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "hidden",
							name: "role_hidden"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "active",
							defaultChecked: editing?.active ?? true
						}), " Active"]
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
export { StaffPage as component };
