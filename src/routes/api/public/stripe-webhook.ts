import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) return new Response("Webhook secret not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const body = await request.text();
        const { getStripe, subscriptionFields } = await import("@/lib/billing.server");
        const stripe = getStripe();

        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        } catch (err) {
          console.error("[stripe-webhook] signature verification failed", err);
          return new Response("Invalid signature", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const applyToOrg = async (customerId: string, fields: Record<string, unknown>) => {
          const { error } = await supabaseAdmin
            .from("organisations")
            .update(fields as never)
            .eq("stripe_customer_id", customerId);
          if (error) console.error("[stripe-webhook] update failed", error.message);
        };

        try {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object;
              const customerId =
                typeof session.customer === "string" ? session.customer : session.customer?.id;
              const subId =
                typeof session.subscription === "string"
                  ? session.subscription
                  : session.subscription?.id;
              if (customerId && subId) {
                const sub = await stripe.subscriptions.retrieve(subId);
                await applyToOrg(customerId, subscriptionFields(sub));
              }
              break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
              const sub = event.data.object;
              const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
              if (customerId) {
                const fields =
                  event.type === "customer.subscription.deleted"
                    ? { subscription_status: "canceled", stripe_subscription_id: null }
                    : subscriptionFields(sub);
                await applyToOrg(customerId, fields);
              }
              break;
            }
            case "invoice.payment_failed": {
              const invoice = event.data.object;
              const customerId =
                typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
              if (customerId) await applyToOrg(customerId, { subscription_status: "past_due" });
              break;
            }
            case "invoice.payment_succeeded": {
              const invoice = event.data.object;
              const customerId =
                typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
              if (customerId) await applyToOrg(customerId, { subscription_status: "active" });
              break;
            }
            default:
              break;
          }
        } catch (err) {
          console.error("[stripe-webhook] handler error", err);
          return new Response("Handler error", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
