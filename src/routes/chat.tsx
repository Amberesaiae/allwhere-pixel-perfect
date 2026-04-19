import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import ConversationSidebar, { type ConvoSummary } from "@/components/chat/ConversationSidebar";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Messages — bluekiosk" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/chat" } });
  },
  component: ChatLayout,
});

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
    <div className="bg-bk-page h-[calc(100vh-4rem)] overflow-hidden">
      <div className="mx-auto max-w-[1440px] h-full grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_340px] gap-0 md:gap-3 md:px-4 md:py-3">
        {/* Sidebar (static, internal scroll) */}
        <div className={`h-full min-h-0 ${showThread ? "hidden md:block" : "block"}`}>
          {loading ? (
            <div className="bg-white md:rounded-2xl md:border md:border-bk-beige h-full flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-bk-muted" />
            </div>
          ) : (
            <ConversationSidebar convos={convos} currentUserId={user?.id ?? ""} activeId={activeId} />
          )}
        </div>

        {/* Thread + right panel rendered via Outlet */}
        <section className={`h-full min-h-0 lg:col-span-2 ${showThread ? "block" : "hidden md:block"}`}>
          {showThread ? (
            <Outlet />
          ) : (
            <div className="hidden md:flex items-center justify-center bg-white rounded-2xl border border-bk-beige h-full text-bk-muted text-[13px]">
              Select a conversation
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
