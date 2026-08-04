import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as supabase } from "./client-BIis5XMj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useOrg } from "./context-DztgDiE_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CJ4eMH5G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { userId } = useOrg();
	const qc = useQueryClient();
	const { data: profile } = useQuery({
		queryKey: ["profile", userId],
		queryFn: async () => (await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()).data
	});
	const [name, setName] = (0, import_react.useState)("");
	const [avatar, setAvatar] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (profile) {
			setName(profile.name);
			setAvatar(profile.avatar_url ?? "");
		}
	}, [profile]);
	const save = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("profiles").update({
				name,
				avatar_url: avatar || null
			}).eq("id", userId);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profile", userId] });
			toast.success("Profile updated");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your profile" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		className: "max-w-md space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: profile?.email ?? "",
				readOnly: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Avatar URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: avatar,
				onChange: (e) => setAvatar(e.target.value),
				placeholder: "https://…"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: save.isPending,
				children: "Save changes"
			})
		]
	}) })] });
}
//#endregion
export { ProfilePage as component };
