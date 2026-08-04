//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BqGC1dqa.js
var manifest = {
	"17bbd2a281c4ebd55e0f6228b23b49f4735932d56985ef806fcb32f3a2f71d76": {
		functionName: "provisionOrgCustomer_createServerFn_handler",
		importer: () => import("./_ssr/billing.functions-D7LSlZwv.mjs")
	},
	"597b0d94ae22e2e31e7185833b595c6ce0f4ccb96f0f5084d2461f7172886f8c": {
		functionName: "syncSubscription_createServerFn_handler",
		importer: () => import("./_ssr/billing.functions-D7LSlZwv.mjs")
	},
	"60a15a641d511ebbde21466f836618d5330370d368a3f31800af38ef9be982cb": {
		functionName: "createPortalSession_createServerFn_handler",
		importer: () => import("./_ssr/billing.functions-D7LSlZwv.mjs")
	},
	"d71b5449b89c25c7001e42fb4d852ee15759f090bcb4e587bd32fd3fea1c0c48": {
		functionName: "createCheckoutSession_createServerFn_handler",
		importer: () => import("./_ssr/billing.functions-D7LSlZwv.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
