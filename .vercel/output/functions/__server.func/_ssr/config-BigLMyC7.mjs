//#region node_modules/.nitro/vite/services/ssr/assets/config-BigLMyC7.js
function getClientEnv(key) {
	try {
		{
			const value = {
				"BASE_URL": "/",
				"DEV": false,
				"MODE": "production",
				"PROD": true,
				"SSR": true,
				"TSS_DEV_SERVER": "false",
				"TSS_DEV_SSR_STYLES_BASEPATH": "/",
				"TSS_DEV_SSR_STYLES_ENABLED": "true",
				"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
				"TSS_INLINE_CSS_ENABLED": "false",
				"TSS_ROUTER_BASEPATH": "",
				"TSS_SERVER_FN_BASE": "/_serverFn/",
				"VITE_SUPABASE_PROJECT_ID": "gmfestdhfojxamtwqsjb",
				"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_T9C_Ld0esw47TBw4eeSasQ_rdKHJ1sJ",
				"VITE_SUPABASE_URL": "https://gmfestdhfojxamtwqsjb.supabase.co"
			}[key];
			if (typeof value === "string" && value.length > 0) return value;
		}
	} catch {}
}
function getServerEnv(key) {
	try {
		if (typeof process !== "undefined" && typeof process.env === "object") {
			const value = process.env[key];
			if (typeof value === "string" && value.length > 0) return value;
		}
	} catch {}
}
function getEnv(key) {
	return getClientEnv(key) ?? getServerEnv(key);
}
function getSupabaseEnv(options) {
	const requireServiceRole = options?.requireServiceRole ?? false;
	const url = getEnv("VITE_SUPABASE_URL") ?? getEnv("SUPABASE_URL");
	const publishableKey = getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("SUPABASE_PUBLISHABLE_KEY") ?? getEnv("VITE_SUPABASE_ANON_KEY") ?? getEnv("SUPABASE_ANON_KEY");
	const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
	const missing = [];
	if (!url) missing.push("SUPABASE_URL");
	if (!publishableKey) missing.push("SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY)");
	if (requireServiceRole && !serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
	if (missing.length > 0) {
		const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Add them to your environment or connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return {
		url,
		publishableKey,
		serviceRoleKey: serviceRoleKey ?? void 0
	};
}
//#endregion
export { getSupabaseEnv as t };
