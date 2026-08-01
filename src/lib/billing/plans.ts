export interface Plan {
  id: "starter" | "growth" | "enterprise";
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  priceId: string | null;
  productId: string | null;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£6",
    period: "per user / month",
    desc: "For small services getting organised.",
    features: ["Up to 10 users", "Rotas & clients", "Basic incident reporting", "Email support"],
    priceId: "price_1TxoPNDgQ2LXa75jZekWUsA9",
    productId: "prod_UxjtnebTNY26H9",
  },
  {
    id: "growth",
    name: "Growth",
    price: "£12",
    period: "per user / month",
    desc: "For services scaling their operations.",
    features: [
      "Unlimited users",
      "Medication (MAR)",
      "Audit logs & compliance",
      "Role-based access",
      "Priority support",
    ],
    priceId: "price_1TxoPpDgQ2LXa75jnNs0RfLM",
    productId: "prod_UxjtRJznDNQIXF",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    desc: "For multi-site groups with bespoke needs.",
    features: [
      "Everything in Growth",
      "SSO & SAML",
      "Dedicated success manager",
      "Custom integrations",
      "99.9% SLA",
    ],
    priceId: null,
    productId: null,
  },
];

export const PRODUCT_TO_PLAN: Record<string, Plan["id"]> = {
  prod_UxjtnebTNY26H9: "starter",
  prod_UxjtRJznDNQIXF: "growth",
};

export function statusLabel(status: string): string {
  switch (status) {
    case "trialing":
      return "Trial";
    case "active":
      return "Active";
    case "past_due":
      return "Past due";
    case "canceled":
      return "Cancelled";
    case "incomplete":
    case "incomplete_expired":
      return "Incomplete";
    case "unpaid":
      return "Unpaid";
    default:
      return status;
  }
}

/** Grace period (days) after a failed payment before access is blocked. */
export const GRACE_PERIOD_DAYS = 7;

export function accessState(org: {
  subscription_status: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
}): { active: boolean; reason: string; daysLeft: number | null } {
  const now = Date.now();
  if (org.subscription_status === "active") {
    return { active: true, reason: "Subscription active", daysLeft: null };
  }
  if (org.subscription_status === "trialing") {
    const end = org.trial_ends_at ? new Date(org.trial_ends_at).getTime() : now;
    const days = Math.ceil((end - now) / 86400000);
    return {
      active: days > 0,
      reason: days > 0 ? `Trial ends in ${days} day${days === 1 ? "" : "s"}` : "Trial expired",
      daysLeft: days,
    };
  }
  if (org.subscription_status === "past_due" || org.subscription_status === "unpaid") {
    const base = org.current_period_end ? new Date(org.current_period_end).getTime() : now;
    const days = Math.ceil((base + GRACE_PERIOD_DAYS * 86400000 - now) / 86400000);
    return {
      active: days > 0,
      reason: days > 0 ? `Payment failed — ${days} day${days === 1 ? "" : "s"} of grace left` : "Grace period ended",
      daysLeft: days,
    };
  }
  return { active: false, reason: "No active subscription", daysLeft: null };
}
