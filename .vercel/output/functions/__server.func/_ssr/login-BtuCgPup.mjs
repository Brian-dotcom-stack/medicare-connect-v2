import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as loginWithGoogle, t as login } from "./auth-B1yI4xqe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BtuCgPup.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const { redirect } = useSearch({ from: "/_auth/login" });
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [googleLoading, setGoogleLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(e.currentTarget));
		setLoading(true);
		try {
			await login(String(data.email), String(data.password));
			toast.success("Welcome back");
			navigate({ to: redirect || "/overview" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sign in failed");
		} finally {
			setLoading(false);
		}
	}
	async function onGoogle() {
		setGoogleLoading(true);
		try {
			await loginWithGoogle();
			setGoogleLoading(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Google sign-in failed");
			setGoogleLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Sign in"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Welcome back to Medicare Connect."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "outline",
			className: "mt-6 w-full",
			onClick: onGoogle,
			disabled: googleLoading,
			children: googleLoading ? "Redirecting…" : "Continue with Google"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
				" or with email",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "email",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "email",
					name: "email",
					type: "email",
					required: true,
					autoComplete: "email"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "text-xs text-primary hover:underline",
						children: "Forgot?"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "password",
					name: "password",
					type: "password",
					autoComplete: "current-password",
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: loading ? "Signing in…" : "Sign in"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-center text-sm text-muted-foreground",
			children: [
				"No account?",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: "text-primary hover:underline",
					children: "Register"
				})
			]
		})
	] });
}
//#endregion
export { LoginPage as component };
