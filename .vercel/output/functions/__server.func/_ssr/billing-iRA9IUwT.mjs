import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, b as ExternalLink, g as LoaderCircle, l as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useOrg } from "./context-DztgDiE_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { a as useServerFn, i as syncSubscription, n as createPortalSession, t as createCheckoutSession } from "./billing.functions-BDubrFe0.mjs";
import { i as statusLabel, r as accessState, t as PLANS } from "./plans-DjuebOYH.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-iRA9IUwT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillingPage() {
	const { activeOrg } = useOrg();
	const orgId = activeOrg?.id;
	const isAdmin = activeOrg?.role === "admin";
	const qc = useQueryClient();
	const { checkout } = useSearch({ from: "/_app/settings/billing" });
	const [busy, setBusy] = (0, import_react.useState)(null);
	const goCheckout = useServerFn(createCheckoutSession);
	const goPortal = useServerFn(createPortalSession);
	const doSync = useServerFn(syncSubscription);
	const { data: billing, isLoading } = useQuery({
		queryKey: ["billing", orgId],
		enabled: !!orgId,
		queryFn: async () => {
			const { data, error } = await supabase.from("organisations").select("plan, subscription_status, trial_ends_at, current_period_end, stripe_customer_id").eq("id", orgId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const refresh = async (silent = false) => {
		if (!orgId) return;
		try {
			setBusy("sync");
			await doSync({ data: { orgId } });
			await qc.invalidateQueries({ queryKey: ["billing", orgId] });
			if (!silent) toast.success("Subscription status refreshed");
		} catch (e) {
			if (!silent) toast.error(e instanceof Error ? e.message : "Could not refresh status");
		} finally {
			setBusy(null);
		}
	};
	(0, import_react.useEffect)(() => {
		if (checkout === "success") {
			toast.success("Subscription started — thanks!");
			refresh(true);
		} else if (checkout === "cancelled") toast.info("Checkout cancelled — no changes made.");
	}, [checkout]);
	const subscribe = async (priceId) => {
		if (!orgId) return;
		try {
			setBusy(priceId);
			const { url } = await goCheckout({ data: {
				orgId,
				priceId,
				origin: window.location.origin
			} });
			window.open(url, "_blank");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not start checkout");
		} finally {
			setBusy(null);
		}
	};
	const openPortal = async () => {
		if (!orgId) return;
		try {
			setBusy("portal");
			const { url } = await goPortal({ data: {
				orgId,
				origin: window.location.origin
			} });
			window.open(url, "_blank");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not open billing portal");
		} finally {
			setBusy(null);
		}
	};
	const access = billing ? accessState(billing) : {
		active: true,
		reason: "",
		daysLeft: null
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Subscription" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Manage your plan, payment method and invoices." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-semibold capitalize",
								children: isLoading ? "Loading…" : `${billing?.plan ?? "starter"} plan`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: access.reason
							}),
							billing?.current_period_end && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["Renews ", new Date(billing.current_period_end).toLocaleDateString()]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: access.active ? "outline" : "destructive",
								children: statusLabel(billing?.subscription_status ?? "trialing")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => refresh(),
								disabled: busy === "sync",
								children: busy === "sync" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
							})]
						})]
					}),
					!access.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
						children: "Your access has lapsed. Choose a plan below to restore full functionality."
					}),
					isAdmin && billing?.stripe_customer_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: openPortal,
						disabled: busy === "portal",
						children: [busy === "portal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-2 h-4 w-4" }), "Manage billing"]
					}),
					!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Only organisation admins can change the subscription."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: PLANS.map((p) => {
					const current = billing?.plan === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: current ? "ring-1 ring-primary" : "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center justify-between",
							children: [p.name, p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Popular" })]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-bold",
								children: p.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: p.period
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-1 text-sm",
								children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-3.5 w-3.5 text-success" }), f]
								}, f))
							}),
							p.priceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-6 w-full",
								variant: current ? "outline" : "default",
								disabled: !isAdmin || busy === p.priceId || current && access.active,
								onClick: () => subscribe(p.priceId),
								children: [busy === p.priceId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), current && access.active ? "Current plan" : "Choose plan"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-6 w-full",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/contact",
									children: "Contact sales"
								})
							})
						] })]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: "Payments run in Stripe test mode for this demo workspace — no real charges are made."
			})
		]
	});
}
//#endregion
export { BillingPage as component };
