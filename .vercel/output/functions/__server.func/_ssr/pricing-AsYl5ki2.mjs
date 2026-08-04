import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Check, N as ArrowRight, a as Sparkles, g as LoaderCircle, o as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { a as useServerFn, t as createCheckoutSession } from "./billing.functions-BDubrFe0.mjs";
import { t as PLANS } from "./plans-DjuebOYH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-AsYl5ki2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var faqs = [
	{
		q: "Is there a free trial?",
		a: "Every organisation starts on a 14-day trial with full access. No card is needed to begin."
	},
	{
		q: "Can I change plan later?",
		a: "Yes — upgrade, downgrade or cancel at any time from Settings → Billing via the self-serve portal."
	},
	{
		q: "What happens if a payment fails?",
		a: "You keep access during a 7-day grace period while you update your card, so care delivery is never interrupted."
	},
	{
		q: "Do you support multiple organisations?",
		a: "Yes. Each organisation is billed separately and data is isolated at the database layer."
	}
];
function PricingPage() {
	const navigate = useNavigate();
	const goCheckout = useServerFn(createCheckoutSession);
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			setUserId(data.session?.user.id ?? null);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			setUserId(session?.user.id ?? null);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const handleSelect = async (planId, priceId) => {
		if (!priceId) {
			navigate({ to: "/contact" });
			return;
		}
		if (!userId) {
			navigate({ to: "/register" });
			return;
		}
		setBusy(planId);
		try {
			const { data: memberships, error } = await supabase.from("org_memberships").select("org_id, role").eq("user_id", userId).limit(1);
			if (error) throw error;
			const membership = memberships?.[0];
			if (!membership) {
				toast.info("Create your organisation first, then pick a plan.");
				navigate({ to: "/onboarding" });
				return;
			}
			if (membership.role !== "admin") {
				toast.error("Only an organisation admin can start a subscription.");
				return;
			}
			const { url } = await goCheckout({ data: {
				orgId: membership.org_id,
				priceId,
				origin: window.location.origin
			} });
			if (url) window.location.href = url;
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not start checkout");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 via-background to-background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-20 text-center md:py-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-success" }), "14-day free trial — no credit card required"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-balance text-4xl font-extrabold tracking-tight md:text-6xl",
						children: "Simple, honest pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl",
						children: "Pay per active user, per month. No setup fees, no minimum term, and you can cancel whenever you like."
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-20 md:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-8 md:grid-cols-3",
				children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative flex flex-col rounded-3xl border bg-card p-8 ${p.highlight ? "border-primary shadow-2xl ring-1 ring-primary/20 md:-my-4 md:py-12" : "border-border shadow-sm"}`,
					children: [
						p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Most popular"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-semibold tracking-tight",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-5xl font-extrabold tracking-tight md:text-6xl",
								children: p.price
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-muted-foreground",
								children: p.period
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-muted-foreground",
							children: p.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-8 space-y-3",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3 text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-5 w-5 shrink-0 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-snug",
									children: f
								})]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								size: "lg",
								variant: p.highlight ? "default" : "outline",
								disabled: busy === p.id,
								onClick: () => handleSelect(p.id, p.priceId),
								children: busy === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Redirecting…"] }) : p.priceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [userId ? "Subscribe" : "Start free trial", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })] }) : "Contact sales"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-xs leading-relaxed text-muted-foreground",
								children: p.priceId ? "Secure checkout via Stripe" : "Tailored quote within one working day"
							})]
						})
					]
				}, p.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-14 text-center text-sm text-muted-foreground",
				children: [
					"Prices in GBP, excluding VAT. Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-medium text-foreground underline",
						children: "Sign in"
					}),
					" ",
					"to manage your subscription."
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-secondary/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl px-4 py-20 md:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center text-3xl font-bold tracking-tight md:text-4xl",
						children: "Pricing questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground",
						children: "Everything you need to know about plans, billing, and switching."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-12 grid gap-6 md:grid-cols-2",
						children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-lg font-semibold text-foreground",
								children: f.q
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-3 leading-relaxed text-muted-foreground",
								children: f.a
							})]
						}, f.q))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/demo",
								children: "Book a demo instead"
							})
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { PricingPage as component };
