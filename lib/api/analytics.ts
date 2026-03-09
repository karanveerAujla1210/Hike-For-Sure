import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    person_profiles: "identified_only"
  });

  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized) {
    initAnalytics();
  }

  if (!initialized) {
    return;
  }

  posthog.capture(event, {
    app: "hike-for-sure",
    ...properties
  });
}
