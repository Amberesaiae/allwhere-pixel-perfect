import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { uploadChatAttachment } from "@/lib/chat";
import { ArrowLeft, Send, Paperclip, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";
import ListingContextPanel from "@/components/chat/ListingContextPanel";
import PriceComparisonSheet from "@/components/chat/PriceComparisonSheet";

export const Route = createFileRoute("/chat/$conversationId")({
  component: ChatThread,
});

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string | null;
  attachment_url: string | null;
  message_type: string;
  created_at: string;
  read_at: string | null;
}

interface ConvoMeta {
  id: string;
  customer_id: string;
  vendor_id: string;
  listing_id: string | null;
  kiosk_id: string;
  listing_title: string | null;
  listing_slug: string | null;
  kiosk_name: string;
  kiosk_slug: string;
  other_name: string;
  other_avatar: string | null;
}

function ChatThread() {
  const { conversationId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<ConvoMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMeta = useCallback(async () => {
    if (!user) return;
    const { data: convo, error } = await supabase
      .from("conversations")
      .select("id, customer_id, vendor_id, listing_id, kiosk_id, listings(title, slug), kiosks(name, slug, cover_image_url)")
      .eq("id", conversationId)
      .maybeSingle();
    if (error || !convo) {
      toast.error("Conversation not found.");
      navigate({ to: "/chat" });
      return;
    }
    const otherId = convo.customer_id === user.id ? convo.vendor_id : convo.customer_id;
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", otherId)
      .maybeSingle();
    setMeta({
      id: convo.id,
      customer_id: convo.customer_id,
      vendor_id: convo.vendor_id,
      listing_id: convo.listing_id,
      kiosk_id: convo.kiosk_id,
      listing_title: (convo as any).listings?.title ?? null,
      listing_slug: (convo as any).listings?.slug ?? null,
      kiosk_name: (convo as any).kiosks?.name ?? "Kiosk",
      kiosk_slug: (convo as any).kiosks?.slug ?? "",
      other_name: profile?.display_name ?? (convo.customer_id === user.id ? (convo as any).kiosks?.name ?? "Vendor" : "Buyer"),
      other_avatar: profile?.avatar_url ?? (convo as any).kiosks?.cover_image_url ?? null,
    });
  }, [conversationId, user, navigate]);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at");
    setMessages((data ?? []) as Message[]);
  }, [conversationId]);

  const markRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);
  }, [conversationId, user]);

  useEffect(() => {
    loadMeta();
    loadMessages().then(markRead);
  }, [loadMeta, loadMessages, markRead]);

  useEffect(() => {
    const channel = supabase
      .channel(`thread-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => {
            const m = payload.new as Message;
            if (prev.some((p) => p.id === m.id)) return prev;
            return [...prev, m];
          });
          if (user && (payload.new as Message).sender_id !== user.id) markRead();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user, markRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async (overrides?: { body?: string; attachment_url?: string; message_type?: string }) => {
    if (!user) return;
    const body = overrides?.body ?? input.trim();
    if (!body && !overrides?.attachment_url) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: body || null,
      attachment_url: overrides?.attachment_url ?? null,
      message_type: overrides?.message_type ?? (overrides?.attachment_url ? "image" : "text"),
    });
    setSending(false);
    if (error) {
      toast.error("Could not send message.");
      return;
    }
    if (!overrides) setInput("");
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadChatAttachment(conversationId, file);
      await send({ attachment_url: url, message_type: file.type.startsWith("image/") ? "image" : "text", body: file.type.startsWith("image/") ? undefined : file.name });
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!meta) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-bk-muted" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 lg:gap-3 h-full min-h-0">
      {/* Thread column */}
      <div className="bg-white md:rounded-2xl md:border md:border-bk-beige flex flex-col h-full min-h-0 overflow-hidden">
        {/* Sticky header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-bk-beige flex-shrink-0">
          <Link to="/chat" className="md:hidden -ml-1 p-1 text-bk-dark" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-bk-beige overflow-hidden flex items-center justify-center flex-shrink-0">
            {meta.other_avatar ? (
              <img src={meta.other_avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[14px] font-bold text-bk-dark">{meta.other_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-bk-dark truncate">{meta.other_name}</p>
            {meta.listing_title && meta.listing_slug ? (
              <Link to="/listing/$slug" params={{ slug: meta.listing_slug }} className="text-[11px] text-bk-muted hover:text-bk-dark truncate block">
                About: {meta.listing_title}
              </Link>
            ) : (
              <Link to="/kiosk/$slug" params={{ slug: meta.kiosk_slug }} className="text-[11px] text-bk-muted hover:text-bk-dark truncate block">
                {meta.kiosk_name}
              </Link>
            )}
          </div>
          <PriceComparisonSheet
            listingId={meta.listing_id}
            kioskId={meta.kiosk_id}
            kioskName={meta.kiosk_name}
            kioskSlug={meta.kiosk_slug}
          />
        </header>

        {/* Messages — own scroll */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 md:px-4 py-4 space-y-1.5 bg-bk-page/40">
          {messages.length === 0 && (
            <p className="text-center text-[12px] text-bk-muted py-8">Send the first message to start the conversation.</p>
          )}
          {messages.map((m, idx) => {
            const mine = m.sender_id === user?.id;
            const prev = messages[idx - 1];
            const showDate = !prev || dayLabel(prev.created_at) !== dayLabel(m.created_at);
            return (
              <div key={m.id}>
                {showDate && (
                  <p className="text-center text-[10px] uppercase tracking-wider text-bk-muted my-3 font-semibold">{dayLabel(m.created_at)}</p>
                )}
                <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${mine ? "bg-bk-yellow text-bk-dark" : "bg-white border border-bk-beige text-bk-dark"}`}>
                    {m.message_type === "image" && m.attachment_url ? (
                      <a href={m.attachment_url} target="_blank" rel="noopener noreferrer">
                        <img src={m.attachment_url} alt="attachment" className="max-w-[240px] rounded-xl" />
                      </a>
                    ) : null}
                    {m.body && <p className="text-[13.5px] whitespace-pre-wrap break-words">{m.body}</p>}
                    <p className={`text-[10px] mt-0.5 ${mine ? "text-bk-dark/60" : "text-bk-muted"} text-right`}>
                      {format(new Date(m.created_at), "HH:mm")}
                      {mine && m.read_at && <span className="ml-1">• Read</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-bk-beige px-3 py-2.5 flex items-center gap-2 bg-white pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex-shrink-0"
        >
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={onPickFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded-full hover:bg-bk-page flex items-center justify-center text-bk-muted transition disabled:opacity-50"
            aria-label="Attach"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full bg-bk-page text-[14px] text-bk-dark placeholder:text-bk-muted focus:outline-none focus:ring-2 focus:ring-bk-yellow"
          />
          <button
            type="submit"
            disabled={sending || (!input.trim())}
            className="w-10 h-10 rounded-full bg-bk-yellow text-bk-dark hover:bg-bk-yellow-hover flex items-center justify-center disabled:opacity-50 transition"
            aria-label="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Right context panel — desktop only (lg+) */}
      <div className="hidden lg:block h-full min-h-0">
        <ListingContextPanel
          listingId={meta.listing_id}
          kioskId={meta.kiosk_id}
          kioskName={meta.kiosk_name}
          kioskSlug={meta.kiosk_slug}
        />
      </div>
    </div>
  );
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}
