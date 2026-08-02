import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { i as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-HBTDFfOd.mjs";
import { t as PageHeader } from "./PageHeader-C_brouRF.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useOrg } from "./context-CLdJq7VD.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-D3LK1kDF.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-uuSNMIs2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const { activeOrg, userId } = useOrg();
	const orgId = activeOrg.id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: items = [] } = useQuery({
		queryKey: [
			"notifications",
			orgId,
			userId
		],
		queryFn: async () => (await supabase.from("notifications").select("*").eq("org_id", orgId).eq("user_id", userId).order("created_at", { ascending: false })).data ?? []
	});
	const { data: members = [] } = useQuery({
		queryKey: ["memberships-full", orgId],
		queryFn: async () => (await supabase.from("org_memberships").select("user_id, role").eq("org_id", orgId)).data ?? []
	});
	const markAll = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("notifications").update({ read: true }).eq("org_id", orgId).eq("user_id", userId);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: [
			"notifications",
			orgId,
			userId
		] })
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("notifications").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: [
			"notifications",
			orgId,
			userId
		] })
	});
	const send = useMutation({
		mutationFn: async (input) => {
			const rows = (input.target === "me" ? [userId] : members.map((m) => m.user_id)).map((uid) => ({
				org_id: orgId,
				user_id: uid,
				title: input.title,
				body: input.body
			}));
			const { error } = await supabase.from("notifications").insert(rows);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"notifications",
				orgId,
				userId
			] });
			toast.success("Notification sent");
			setOpen(false);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	function onSubmit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		send.mutate({
			title: String(f.get("title")),
			body: String(f.get("body") ?? ""),
			target: String(f.get("target"))
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Notifications",
			description: "Alerts and reminders for your workspace.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => markAll.mutate(),
					children: "Mark all read"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex items-start gap-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1.5 h-2 w-2 rounded-full ${n.read ? "bg-border" : "bg-primary"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: new Date(n.created_at).toLocaleString()
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => del.mutate(n.id),
						"aria-label": "Delete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})
				]
			}) }, n.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "No notifications."
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Send notification" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "title",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "body",
						rows: 3
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Send to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "target",
						defaultValue: "me",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "me",
							children: "Just me"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Everyone in this organisation"
						})] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: send.isPending,
						children: "Send"
					}) })
				]
			})] })
		})
	] });
}
//#endregion
export { NotificationsPage as component };
