"use client";

import { useEffect, useState } from "react";

import { sendMessage } from "@/lib/api/messages";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function MessageBox({
  receiverId,
  initialMessages,
  currentUserId
}: {
  receiverId: string;
  initialMessages: ChatMessage[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`messages-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          const next = payload.new as ChatMessage;
          if (
            next.sender_id === receiverId ||
            next.receiver_id === receiverId
          ) {
            setMessages((prev) => [...prev, next]);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, receiverId]);

  async function handleSend() {
    if (!content.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await sendMessage({
        receiverId,
        content: content.trim()
      });

      setMessages((prev) => [
        ...prev,
        {
          id: response.id,
          sender_id: currentUserId,
          receiver_id: receiverId,
          content: content.trim(),
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]);
      setContent("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 max-h-96 overflow-y-auto space-y-2">
        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  mine
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="mt-1 text-[10px] opacity-80">
                  {new Date(message.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Type your message..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
