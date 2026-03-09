import Script from "next/script";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { SubscriptionPlans } from "@/components/forms/SubscriptionPlans";
import { getAuthContext } from "@/lib/auth/server";

export default async function SubscriptionPage() {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }

  return (
    <PageShell
      title="Subscription"
      subtitle="Choose a recruiter plan and unlock posting and analytics features."
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <SubscriptionPlans />
    </PageShell>
  );
}
