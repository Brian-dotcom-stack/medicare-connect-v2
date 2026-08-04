import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { a as updatePassword } from "./auth-B1yI4xqe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-BaEhEwMJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [valid, setValid] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		(async () => {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) throw error;
				if (data.session?.user) {
					if (mounted) setValid(true);
				} else {
					const { data: hashSession, error: hashErr } = await supabase.auth.getSession();
					if (hashErr) throw hashErr;
					if (mounted) setValid(!!hashSession.session?.user);
				}
			} catch (e) {
				if (mounted) toast.error(e instanceof Error ? e.message : "Invalid or expired reset link");
			} finally {
				if (mounted) setChecking(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		const password = String(new FormData(e.currentTarget).get("password") ?? "");
		setLoading(true);
		try {
			await updatePassword(password);
			toast.success("Password updated");
			await supabase.auth.signOut();
			navigate({ to: "/login" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update password");
		} finally {
			setLoading(false);
		}
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-6 text-center text-sm text-muted-foreground",
		children: "Verifying your reset link…"
	});
	if (!valid) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Invalid reset link"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: "This password reset link is invalid or has expired. Please request a new one."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			className: "mt-6 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/forgot-password",
				children: "Request a new link"
			})
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Set a new password"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Enter your new password below."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mt-6 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "password",
				children: "New password"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "password",
				name: "password",
				type: "password",
				minLength: 8,
				autoComplete: "new-password",
				required: true
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: loading,
				children: loading ? "Saving…" : "Update password"
			})]
		})
	] });
}
//#endregion
export { ResetPasswordPage as component };
