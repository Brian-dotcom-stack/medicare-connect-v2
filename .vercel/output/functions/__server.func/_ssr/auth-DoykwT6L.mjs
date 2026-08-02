import { n as supabase } from "./client-HBTDFfOd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DoykwT6L.js
/**
* Real Supabase authentication helpers used by the auth routes.
*
* This replaces the old localStorage-cached mock flow. Sessions are managed
* entirely by `@supabase/supabase-js` (localStorage persistence + auto refresh),
* and the dashboard reads the live user through `useOrg()`.
*/
function toAuthUser(user) {
	const email = user.email ?? "";
	return {
		id: user.id,
		email,
		name: user.user_metadata?.name ?? email.split("@")[0] ?? "User",
		emailVerified: !!user.email_confirmed_at
	};
}
/** Sign in with email + password. Throws an Error on failure. */
async function login(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	if (error) throw error;
	if (!data.user) throw new Error("Sign in succeeded but no user was returned.");
	return toAuthUser(data.user);
}
/**
* Register a new account.
*
* `requiresEmailConfirmation` is true when Supabase is configured to require
* email verification and the sign-up did not auto-confirm the user — the UI
* should route to `/verify-email` in that case.
*/
async function register(name, email, password) {
	const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/overview` : void 0;
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { name },
			emailRedirectTo: redirectTo
		}
	});
	if (error) throw error;
	return {
		user: data.user ? toAuthUser(data.user) : null,
		session: data.session,
		requiresEmailConfirmation: !!data.user && !data.session && !data.user.email_confirmed_at
	};
}
/**
* OAuth sign-in with Google through Supabase.
*
* Uses Supabase's native `signInWithOAuth` (rather than Lovable Cloud Auth) so
* the flow works on standalone Vercel deployments where the Lovable redirect
* handler is not present. After Google returns, supabase-js detects the token
* in the URL and persists the session automatically.
*/
async function loginWithGoogle() {
	const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/overview` : void 0;
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: { redirectTo }
	});
	if (error) throw error;
}
/** Send a password reset email. */
async function requestPasswordReset(email) {
	const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : void 0;
	const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
	if (error) throw error;
}
/** Update the password for the currently authenticated user. */
async function updatePassword(newPassword) {
	const { error } = await supabase.auth.updateUser({ password: newPassword });
	if (error) throw error;
}
//#endregion
export { updatePassword as a, requestPasswordReset as i, loginWithGoogle as n, register as r, login as t };
