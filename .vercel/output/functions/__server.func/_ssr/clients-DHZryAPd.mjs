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
//#region node_modules/.nitro/vite/services/ssr/assets/clients-DHZryAPd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientsPage() {
	const { activeOrg, userId, name: actorName } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: clients = [] } = useQuery({
		queryKey: ["clients", orgId],
		queryFn: async () => {
			const { data, error } = await supabase.from("clients").select("*").eq("org_id", orgId).order("name");
			if (error) throw error;
			return data;
		}
	});
	const upsert = useMutation({
		mutationFn: async (input) => {
			if (editing) {
				const { error } = await supabase.from("clients").update({
					name: input.name,
					date_of_birth: input.date_of_birth || null,
					address: input.address ?? "",
					key_contact: input.key_contact ?? "",
					care_level: input.care_level,
					notes: input.notes ?? ""
				}).eq("id", editing.id);
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "client.update", input.name);
			} else {
				const { error } = await supabase.from("clients").insert({
					org_id: orgId,
					name: input.name,
					date_of_birth: input.date_of_birth || null,
					address: input.address ?? "",
					key_contact: input.key_contact ?? "",
					care_level: input.care_level,
					notes: input.notes ?? ""
				});
				if (error) throw error;
				await logAudit(orgId, userId, actorName, "client.create", input.name);
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clients", orgId] });
			toast.success(editing ? "Client updated" : "Client added");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const del = useMutation({
		mutationFn: async (row) => {
			const { error } = await supabase.from("clients").delete().eq("id", row.id);
			if (error) throw error;
			await logAudit(orgId, userId, actorName, "client.delete", row.name);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clients", orgId] });
			toast.success("Client removed");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		upsert.mutate({
			name: String(f.get("name")),
			date_of_birth: String(f.get("date_of_birth") ?? ""),
			address: String(f.get("address") ?? ""),
			key_contact: String(f.get("key_contact") ?? ""),
			care_level: String(f.get("care_level")),
			notes: String(f.get("notes") ?? "")
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Clients",
			description: "People receiving care and support.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add client"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "DOB" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Care level" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Key contact" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Address" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-10" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium",
					children: c.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: c.date_of_birth ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "capitalize",
					variant: c.care_level === "high" ? "destructive" : "secondary",
					children: c.care_level
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.key_contact || "—" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "max-w-xs truncate text-muted-foreground",
					children: c.address || "—"
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
							setEditing(c);
							setOpen(true);
						},
						children: "Edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
						className: "text-destructive",
						onClick: () => {
							if (confirm(`Remove ${c.name}?`)) del.mutate(c);
						},
						children: "Delete"
					})]
				})] }) })
			] }, c.id)), clients.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "No clients yet."
			}) })] })] })
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit client" : "Add client" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						defaultValue: editing?.name,
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date of birth" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "date_of_birth",
						type: "date",
						defaultValue: editing?.date_of_birth ?? ""
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "address",
						defaultValue: editing?.address
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Key contact" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "key_contact",
						defaultValue: editing?.key_contact
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Care level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "care_level",
						defaultValue: editing?.care_level ?? "low",
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
							})
						] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "notes",
						defaultValue: editing?.notes,
						rows: 3
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
export { ClientsPage as component };
