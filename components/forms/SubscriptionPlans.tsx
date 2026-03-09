"use client";

import { useState } from "react";

import { createSubscriptionCheckout } from "@/lib/api/subscriptions";
import { trackEvent } from "@/lib/api/analytics";
import { Button } from "@/components/ui/button";

type Plan = {
  key: "free" | "pro";
  name: string;
  priceLabel: string;
  features: string[];
};

const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    priceLabel: "₹0 / month",
    features: ["3 job posts per month", "Basic applicant management"]
  },
  {
    key: "pro",
    name: "Pro",
    priceLabel: "₹999 / month",
    features: [
      "Unlimited job posts",
      "Applicant analytics",
      "Priority profile visibility"
    ]
  }
];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function SubscriptionPlans() {
  const [loadingPlan, setLoadingPlan] = useState<Plan["key"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(plan: Plan["key"]) {
    setLoadingPlan(plan);
    setError(null);

    try {
      if (plan === "free") {
        await createSubscriptionCheckout("free");
        return;
      }

      const checkout = await createSubscriptionCheckout(plan);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded.");
      }

      const payment = new window.Razorpay({
        key: checkout.razorpayKeyId,
        subscription_id: checkout.subscriptionId,
        name: "Hike For Sure",
        description: "Recruiter Pro Subscription",
        handler: () => {
          trackEvent("subscription_conversion", { plan });
          window.location.reload();
        }
      });
      payment.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <article
          key={plan.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-700">{plan.priceLabel}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {plan.features.map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
          <Button
            className="mt-5 w-full"
            onClick={() => handleSubscribe(plan.key)}
            disabled={loadingPlan === plan.key}
          >
            {loadingPlan === plan.key ? "Please wait..." : `Select ${plan.name}`}
          </Button>
        </article>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
