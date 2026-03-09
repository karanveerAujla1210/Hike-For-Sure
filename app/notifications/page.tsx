import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getAuthContext } from "@/lib/auth/server";
import { fetchMyNotifications } from "@/lib/db/queries";

export default async function NotificationsPage() {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }

  const notifications = await fetchMyNotifications();

  return (
    <PageShell
      title="Notifications"
      subtitle="Track application updates, messages, and recruiter activity."
    >
      <div className="space-y-2">
        {notifications.length ? (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
              <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(notification.created_at).toLocaleString("en-IN")}
              </p>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No notifications yet.
          </p>
        )}
      </div>
    </PageShell>
  );
}
