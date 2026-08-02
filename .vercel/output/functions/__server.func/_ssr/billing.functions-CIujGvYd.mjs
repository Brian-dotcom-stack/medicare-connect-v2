import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { k as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-D981qC_e.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DrFDNDQy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.functions-CIujGvYd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createCheckoutSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("d71b5449b89c25c7001e42fb4d852ee15759f090bcb4e587bd32fd3fea1c0c48"));
var createPortalSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("60a15a641d511ebbde21466f836618d5330370d368a3f31800af38ef9be982cb"));
var syncSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("597b0d94ae22e2e31e7185833b595c6ce0f4ccb96f0f5084d2461f7172886f8c"));
/** Creates the Stripe customer for a newly created organisation. */
var provisionOrgCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("17bbd2a281c4ebd55e0f6228b23b49f4735932d56985ef806fcb32f3a2f71d76"));
//#endregion
export { useServerFn as a, syncSubscription as i, createPortalSession as n, provisionOrgCustomer as r, createCheckoutSession as t };
