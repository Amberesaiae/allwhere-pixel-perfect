import { createFileRoute, Outlet, Link, redirect, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Messages — bluekiosk" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/chat" } });
  },
  component: ChatLayout,
});

interface ConvoSummary {
  id: string;
  listing_id: string | null;
  kiosk_id: string;
  customer_id: string;
  vendor_id: string;
  last_message_at: string;
  other_name: string;
  other_avatar: string | null;
  context_title: string;
  preview: string;
  unread: number;
}

function ChatLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [convos, setConvos] = useState<ConvoSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: rows } = await supabase
      .from("conversations")
      .select("*, listings(title), kiosks(name, cover_image_url)")
      .or(`customer_id.eq.${user.id},vendor_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (!rows) {
      setConvos([]);
      setLoading(false);
      return;
    }

    const otherIds = Array.from(new Set(rows.map((r) => (r.customer_id === user.id ? r.vendor_id : r.customer_id))));
    const ids = rows.map((r) => r.id);

    const [profilesRes, lastMsgsRes, unreadRes] = await Promise.all([
      otherIds.length
        ? supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", otherIds)
        : Promise.resolve({ data: [] as any[] }),
      supabase.from("messages").select("conversation_id, body, message_type, created_at").in("conversation_id", ids).order("created_at", { ascending: false }),
      supabase.from("messages").select("conversation_id").in("conversation_id", ids).neq("sender_id", user.id).is("read_at", null),
    ]);

    const profileMap = new Map((profilesRes.data ?? []).map((p: any) => [p.user_id, p]));
    const lastByConvo = new Map<string, any>();
    for (const m of (lastMsgsRes.data ?? []) as any[]) {
      if (!lastByConvo.has(m.conversation_id)) lastByConvo.set(m.conversation_id, m);
    }
    const unreadByConvo = new Map<string, number>();
    for (const m of (unreadRes.data ?? []) as any[]) {
      unreadByConvo.set(m.conversation_id, (unreadByConvo.get(m.conversation_id) ?? 0) + 1);
    }

    setConvos(
      rows.map((r: any) => {
        const otherId = r.customer_id === user.id ? r.vendor_id : r.customer_id;
        const profile = profileMap.get(otherId);
        const last = lastByConvo.get(r.id);
        const preview =
          !last ? "No messages yet"
          : last.message_type === "image" ? "Sent a photo"
          : last.message_type === "transaction_card" ? "Shared a transaction"
          : (last.body ?? "");
        return {
          id: r.id,
          listing_id: r.listing_id,
          kiosk_id: r.kiosk_id,
          customer_id: r.customer_id,
          vendor_id: r.vendor_id,
          last_message_at: r.last_message_at,
          other_name: profile?.display_name ?? (r.customer_id === user.id ? r.kiosks?.name ?? "Vendor" : "Buyer"),
          other_avatar: profile?.avatar_url ?? r.kiosks?.cover_image_url ?? null,
          context_title: r.listings?.title ?? r.kiosks?.name ?? "Conversation",
          preview,
          unread: unreadByConvo.get(r.id) ?? 0,
        };
      })
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(`convos-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, user]);

  const activeId = location.pathname.split("/chat/")[1] ?? null;
  const showThread = !!activeId;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bk-page">
      <div className="mx-auto max-w-[1280px] grid md:grid-cols-[340px_1fr] gap-0 md:gap-4 md:px-6 md:py-4">
        {/* List pane */}
        <aside className={`bg-white md:rounded-2xl md:border md:border-bk-beige overflow-hidden ${showThread ? "hidden md:block" : "block"}`}>
          <div className="px-4 py-3 border-b border-bk-beige flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-bk-muted" />
            <h2 className="text-[15px] font-bold text-bk-dark">Messages</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-bk-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : convos.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No conversations yet"
              description="Start a chat from any listing or kiosk page."
            />
          ) : (
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
              {convos.map((c) => (
                <Link
                  key={c.id}
                  to="/chat/$conversationId"
                  params={{ conversationId: c.id }}
                  className={`flex items-start gap-3 p-3 border-b border-bk-beige hover:bg-bk-page transition ${activeId === c.id ? "bg-bk-page" : ""}`}
                >
                  <div className="w-11 h-11 rounded-full bg-bk-beige flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.other_avatar ? (
                      <img src={c.other_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[14px] font-bold text-bk-dark">{c.other_name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[13px] font-bold text-bk-dark truncate">{c.other_name}</p>
                      <span className="text-[10px] text-bk-muted whitespace-nowrap">{formatDistanceToNow(new Date(c.last_message_at), { addSuffix: false })}</span>
                    </div>
                    <p className="text-[11px] text-bk-muted truncate">{c.context_title}</p>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={`text-[12px] truncate ${c.unread > 0 ? "text-bk-dark font-semibold" : "text-bk-muted"}`}>{c.preview}</p>
                      {c.unread > 0 && (
                        <span className="bg-bk-yellow text-bk-dark text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* Thread pane */}
        <section className={`${showThread ? "block" : "hidden md:block"}`}>
          <Outlet />
          {!showThread && (
            <div className="hidden md:flex items-center justify-center bg-white rounded-2xl border border-bk-beige h-[calc(100vh-8rem)] text-bk-muted text-[13px]">
              Select a conversation
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
