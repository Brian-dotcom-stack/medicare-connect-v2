import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CltlZHwK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-XXNSQ1Gy.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$30 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Medicare Connect — Care management, simplified" },
			{
				name: "description",
				content: "Modern care management for domiciliary and residential providers. Rotas, medications, incidents, and compliance in one place."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$30.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		let unsubscribe;
		(async () => {
			const { supabase } = await import("./client-BIis5XMj.mjs").then((n) => n.t).then((n) => n.t);
			const { data: sub } = supabase.auth.onAuthStateChange(() => {
				if (mounted) router.invalidate();
			});
			unsubscribe = () => sub.subscription.unsubscribe();
		})();
		return () => {
			mounted = false;
			unsubscribe?.();
		};
	}, [router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$27 = () => import("./route-mnz51_hN.mjs");
var Route$29 = createFileRoute("/_app")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		if (typeof window === "undefined") return;
		const { data } = await supabase.auth.getSession();
		if (!data.session) throw redirect({
			to: "/login",
			search: { redirect: location.href.startsWith(window.location.origin) ? location.href : "/overview" }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./route-DBmZI3Fs.mjs");
var Route$28 = createFileRoute("/_auth")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./route-TOO3r-YX.mjs");
var Route$27 = createFileRoute("/_marketing")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./audit-BEa-Y0al.mjs");
var Route$26 = createFileRoute("/_app/audit")({
	head: () => ({ meta: [{ title: "Audit log — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./clients-DHZryAPd.mjs");
var Route$25 = createFileRoute("/_app/clients")({
	head: () => ({ meta: [{ title: "Clients — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./incidents-C70siLWI.mjs");
var Route$24 = createFileRoute("/_app/incidents")({
	head: () => ({ meta: [{ title: "Incidents — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./medications-CDe8RrTA.mjs");
var Route$23 = createFileRoute("/_app/medications")({
	head: () => ({ meta: [{ title: "Medications — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./notifications-CjD7SodE.mjs");
var Route$22 = createFileRoute("/_app/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./onboarding-DN4Dn9J6.mjs");
var Route$21 = createFileRoute("/_app/onboarding")({
	head: () => ({ meta: [{ title: "Set up your organisation — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./overview-D-Dru0pB.mjs");
var Route$20 = createFileRoute("/_app/overview")({
	head: () => ({ meta: [{ title: "Overview — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./rotas-dyeYUrb5.mjs");
var Route$19 = createFileRoute("/_app/rotas")({
	head: () => ({ meta: [{ title: "Rotas — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./route-HGFhrZFJ.mjs");
var Route$18 = createFileRoute("/_app/settings")({
	head: () => ({ meta: [{ title: "Settings — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./staff-C8sERqRp.mjs");
var Route$17 = createFileRoute("/_app/staff")({
	head: () => ({ meta: [{ title: "Staff — Medicare Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./forgot-password-jlmF9aBU.mjs");
var Route$16 = createFileRoute("/_auth/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — Medicare Connect" }, {
		name: "description",
		content: "Reset your password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./login-BtuCgPup.mjs");
var Route$15 = createFileRoute("/_auth/login")({
	validateSearch: (s) => ({ redirect: s.redirect || void 0 }),
	head: () => ({ meta: [{ title: "Sign in — Medicare Connect" }, {
		name: "description",
		content: "Sign in to your Medicare Connect workspace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./register-Dd3wOR7A.mjs");
var Route$14 = createFileRoute("/_auth/register")({
	head: () => ({ meta: [{ title: "Create account — Medicare Connect" }, {
		name: "description",
		content: "Create your Medicare Connect workspace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./reset-password-BaEhEwMJ.mjs");
var Route$13 = createFileRoute("/_auth/reset-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set new password — Medicare Connect" }, {
		name: "description",
		content: "Choose a new password for your account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./verify-email-0oK_RATS.mjs");
var Route$12 = createFileRoute("/_auth/verify-email")({
	head: () => ({ meta: [{ title: "Verify email — Medicare Connect" }, {
		name: "description",
		content: "Verify your email address."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_marketing-BWiOeuuV.mjs");
var Route$11 = createFileRoute("/_marketing/")({
	head: () => ({ meta: [
		{ title: "Medicare Connect — Care management, simplified" },
		{
			name: "description",
			content: "One platform for rotas, medications, incidents, and compliance across your care service."
		},
		{
			property: "og:title",
			content: "Medicare Connect"
		},
		{
			property: "og:description",
			content: "Care management for modern providers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./contact-CL1w054Z.mjs");
var Route$10 = createFileRoute("/_marketing/contact")({
	head: () => ({ meta: [
		{ title: "Contact — Medicare Connect" },
		{
			name: "description",
			content: "Get in touch with the Medicare Connect team."
		},
		{
			property: "og:title",
			content: "Contact — Medicare Connect"
		},
		{
			property: "og:description",
			content: "Get in touch with the team."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./demo-D0b39S98.mjs");
var Route$9 = createFileRoute("/_marketing/demo")({
	head: () => ({ meta: [
		{ title: "Book a demo — Medicare Connect" },
		{
			name: "description",
			content: "See Medicare Connect running with your team's workflow."
		},
		{
			property: "og:title",
			content: "Book a demo — Medicare Connect"
		},
		{
			property: "og:description",
			content: "20-minute personalised walkthrough."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./features-C_UuFgvv.mjs");
var Route$8 = createFileRoute("/_marketing/features")({
	head: () => ({ meta: [
		{ title: "Features — Rotas, MAR, Incidents & Billing | Medicare Connect" },
		{
			name: "description",
			content: "Rotas, client records, incident reporting, medication MAR, subscription billing and multi-tenant security — one calm workspace for care providers."
		},
		{
			property: "og:title",
			content: "Features — Medicare Connect"
		},
		{
			property: "og:description",
			content: "Rotas, clients, incidents, medications, billing and multi-tenant security in one care management platform."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./how-it-works-ucy_y2kZ.mjs");
var Route$7 = createFileRoute("/_marketing/how-it-works")({
	head: () => ({ meta: [
		{ title: "How it works — Medicare Connect" },
		{
			name: "description",
			content: "From onboarding to daily operations in four simple steps."
		},
		{
			property: "og:title",
			content: "How it works — Medicare Connect"
		},
		{
			property: "og:description",
			content: "From onboarding to daily operations in four simple steps."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./pricing-AsYl5ki2.mjs");
var Route$6 = createFileRoute("/_marketing/pricing")({
	head: () => ({ meta: [
		{ title: "Pricing — Starter, Growth & Enterprise | Medicare Connect" },
		{
			name: "description",
			content: "Simple per-user pricing for care providers. Starter £6, Growth £12, Enterprise custom. 14-day free trial, cancel anytime."
		},
		{
			property: "og:title",
			content: "Pricing — Medicare Connect"
		},
		{
			property: "og:description",
			content: "Starter, Growth and Enterprise plans for care services. 14-day free trial, no card required."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$5 = createFileRoute("/_app/settings/")({ beforeLoad: () => {
	throw redirect({ to: "/settings/profile" });
} });
var $$splitComponentImporter$3 = () => import("./billing-iRA9IUwT.mjs");
var Route$4 = createFileRoute("/_app/settings/billing")({
	validateSearch: (s) => ({ checkout: s.checkout || void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./organisation-Cfdfp4Lh.mjs");
var Route$3 = createFileRoute("/_app/settings/organisation")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./profile-CJ4eMH5G.mjs");
var Route$2 = createFileRoute("/_app/settings/profile")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./team-1krUw_1U.mjs");
var Route$1 = createFileRoute("/_app/settings/team")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/public/stripe-webhook")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!secret) return new Response("Webhook secret not configured", { status: 500 });
	const signature = request.headers.get("stripe-signature");
	if (!signature) return new Response("Missing signature", { status: 400 });
	const body = await request.text();
	const { getStripe, subscriptionFields } = await import("./billing.server-XLLNLYhE.mjs");
	const stripe = getStripe();
	let event;
	try {
		event = await stripe.webhooks.constructEventAsync(body, signature, secret);
	} catch (err) {
		console.error("[stripe-webhook] signature verification failed", err);
		return new Response("Invalid signature", { status: 401 });
	}
	const { supabaseAdmin } = await import("./client.server-CcnymUdO.mjs");
	const applyToOrg = async (customerId, fields) => {
		const { error } = await supabaseAdmin.from("organisations").update(fields).eq("stripe_customer_id", customerId);
		if (error) console.error("[stripe-webhook] update failed", error.message);
	};
	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object;
				const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
				const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
				if (customerId && subId) await applyToOrg(customerId, subscriptionFields(await stripe.subscriptions.retrieve(subId)));
				break;
			}
			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				const sub = event.data.object;
				const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
				if (customerId) await applyToOrg(customerId, event.type === "customer.subscription.deleted" ? {
					subscription_status: "canceled",
					stripe_subscription_id: null
				} : subscriptionFields(sub));
				break;
			}
			case "invoice.payment_failed": {
				const invoice = event.data.object;
				const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
				if (customerId) await applyToOrg(customerId, { subscription_status: "past_due" });
				break;
			}
			case "invoice.payment_succeeded": {
				const invoice = event.data.object;
				const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
				if (customerId) await applyToOrg(customerId, { subscription_status: "active" });
				break;
			}
			default: break;
		}
	} catch (err) {
		console.error("[stripe-webhook] handler error", err);
		return new Response("Handler error", { status: 500 });
	}
	return Response.json({ received: true });
} } } });
var AppRouteRoute = Route$29.update({
	id: "/_app",
	getParentRoute: () => Route$30
});
var AuthRouteRoute = Route$28.update({
	id: "/_auth",
	getParentRoute: () => Route$30
});
var MarketingRouteRoute = Route$27.update({
	id: "/_marketing",
	getParentRoute: () => Route$30
});
var AppAuditRoute = Route$26.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AppRouteRoute
});
var AppClientsRoute = Route$25.update({
	id: "/clients",
	path: "/clients",
	getParentRoute: () => AppRouteRoute
});
var AppIncidentsRoute = Route$24.update({
	id: "/incidents",
	path: "/incidents",
	getParentRoute: () => AppRouteRoute
});
var AppMedicationsRoute = Route$23.update({
	id: "/medications",
	path: "/medications",
	getParentRoute: () => AppRouteRoute
});
var AppNotificationsRoute = Route$22.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRouteRoute
});
var AppOnboardingRoute = Route$21.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AppRouteRoute
});
var AppOverviewRoute = Route$20.update({
	id: "/overview",
	path: "/overview",
	getParentRoute: () => AppRouteRoute
});
var AppRotasRoute = Route$19.update({
	id: "/rotas",
	path: "/rotas",
	getParentRoute: () => AppRouteRoute
});
var AppSettingsRouteRoute = Route$18.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRouteRoute
});
var AppStaffRoute = Route$17.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AppRouteRoute
});
var AuthForgotPasswordRoute = Route$16.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => AuthRouteRoute
});
var AuthLoginRoute = Route$15.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AuthRouteRoute
});
var AuthRegisterRoute = Route$14.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => AuthRouteRoute
});
var AuthResetPasswordRoute = Route$13.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => AuthRouteRoute
});
var AuthVerifyEmailRoute = Route$12.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => AuthRouteRoute
});
var MarketingIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => MarketingRouteRoute
});
var MarketingContactRoute = Route$10.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => MarketingRouteRoute
});
var MarketingDemoRoute = Route$9.update({
	id: "/demo",
	path: "/demo",
	getParentRoute: () => MarketingRouteRoute
});
var MarketingFeaturesRoute = Route$8.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => MarketingRouteRoute
});
var MarketingHowItWorksRoute = Route$7.update({
	id: "/how-it-works",
	path: "/how-it-works",
	getParentRoute: () => MarketingRouteRoute
});
var MarketingPricingRoute = Route$6.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => MarketingRouteRoute
});
var AppSettingsIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppSettingsRouteRoute
});
var AppSettingsBillingRoute = Route$4.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => AppSettingsRouteRoute
});
var AppSettingsOrganisationRoute = Route$3.update({
	id: "/organisation",
	path: "/organisation",
	getParentRoute: () => AppSettingsRouteRoute
});
var AppSettingsProfileRoute = Route$2.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppSettingsRouteRoute
});
var AppSettingsTeamRoute = Route$1.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => AppSettingsRouteRoute
});
var ApiPublicStripeWebhookRoute = Route.update({
	id: "/api/public/stripe-webhook",
	path: "/api/public/stripe-webhook",
	getParentRoute: () => Route$30
});
var AppSettingsRouteRouteChildren = {
	AppSettingsBillingRoute,
	AppSettingsOrganisationRoute,
	AppSettingsProfileRoute,
	AppSettingsTeamRoute,
	AppSettingsIndexRoute
};
var AppRouteRouteChildren = {
	AppSettingsRouteRoute: AppSettingsRouteRoute._addFileChildren(AppSettingsRouteRouteChildren),
	AppAuditRoute,
	AppClientsRoute,
	AppIncidentsRoute,
	AppMedicationsRoute,
	AppNotificationsRoute,
	AppOnboardingRoute,
	AppOverviewRoute,
	AppRotasRoute,
	AppStaffRoute
};
var AppRouteRouteWithChildren = AppRouteRoute._addFileChildren(AppRouteRouteChildren);
var AuthRouteRouteChildren = {
	AuthForgotPasswordRoute,
	AuthLoginRoute,
	AuthRegisterRoute,
	AuthResetPasswordRoute,
	AuthVerifyEmailRoute
};
var AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(AuthRouteRouteChildren);
var MarketingRouteRouteChildren = {
	MarketingContactRoute,
	MarketingDemoRoute,
	MarketingFeaturesRoute,
	MarketingHowItWorksRoute,
	MarketingPricingRoute,
	MarketingIndexRoute
};
var rootRouteChildren = {
	AppRouteRoute: AppRouteRouteWithChildren,
	AuthRouteRoute: AuthRouteRouteWithChildren,
	MarketingRouteRoute: MarketingRouteRoute._addFileChildren(MarketingRouteRouteChildren),
	ApiPublicStripeWebhookRoute
};
var routeTree = Route$30._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
