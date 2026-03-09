import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { MessageBox, type ChatMessage } from "@/components/messageBox/MessageBox";
import { getAuthContext } from "@/lib/auth/server";
import { fetchConversation } from "@/lib/db/queries";

export default async function MessagesPage({
  searchParams
}: {
  searchParams: { with?: string };
}) {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }

  const receiverId = searchParams.with;

  if (!receiverId) {
    return (
      <PageShell
        title="Messages"
        subtitle="Open a conversation from a candidate or recruiter profile."
      >
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Add <code>?with=USER_ID</code> to start or continue a conversation.
        </p>
      </PageShell>
    );
  }

  const messages = await fetchConversation(receiverId);

  return (
    <PageShell
      title="Messages"
      subtitle="Real-time recruiter-candidate communication powered by Supabase Realtime."
    >
      <MessageBox
        receiverId={receiverId}
        initialMessages={messages as ChatMessage[]}
        currentUserId={auth.userId}
      />
    </PageShell>
  );
}
