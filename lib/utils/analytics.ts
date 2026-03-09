import { getServerEnv } from "@/lib/utils/env";

interface TrackEventInput {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}

export async function trackServerEvent({
  distinctId,
  event,
  properties = {}
}: TrackEventInput) {
  const env = getServerEnv();
  if (!env.POSTHOG_KEY) {
    return;
  }

  await fetch("https://app.posthog.com/capture/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: env.POSTHOG_KEY,
      event,
      distinct_id: distinctId,
      properties
    })
  });
}
