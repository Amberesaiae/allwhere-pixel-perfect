import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ShoppingBag, Store, Inbox, MessageSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ConvoSummary {
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

interface Props {
  convos: ConvoSummary[];
  currentUserId: string;
  activeId: string | null;
}

function ConvoLink({ c, activeId }: { c: ConvoSummary; activeId: string | null }) {
  return (
    <Link
      to="/chat/$conversationId"
      params={{ conversationId: c.id }}
      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-bk-page transition ${
        activeId === c.id ? "bg-bk-page" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-bk-beige flex items-center justify-center overflow-hidden flex-shrink-0">
        {c.other_avatar ? (
          <img src={c.other_avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[12px] font-bold text-bk-dark">{c.other_name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[12.5px] font-bold text-bk-dark truncate">{c.other_name}</p>
          <span className="text-[10px] text-bk-muted whitespace-nowrap">
            {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: false })}
          </span>
        </div>
        <p className="text-[10.5px] text-bk-muted truncate">{c.context_title}</p>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={`text-[11.5px] truncate ${c.unread > 0 ? "text-bk-dark font-semibold" : "text-bk-muted"}`}>
            {c.preview}
          </p>
          {c.unread > 0 && (
            <span className="bg-bk-yellow text-bk-dark text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {c.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Section({
  title,
  icon: Icon,
  items,
  activeId,
  emptyText,
}: {
  title: string;
  icon: typeof Inbox;
  items: ConvoSummary[];
  activeId: string | null;
  emptyText: string;
}) {
  return (
    <ScrollArea className="max-h-[40vh] pr-1">
      <div className="space-y-0.5 py-1">
        {items.length === 0 ? (
          <p className="text-[11.5px] text-bk-muted px-3 py-3">{emptyText}</p>
        ) : (
          items.map((c) => <ConvoLink key={c.id} c={c} activeId={activeId} />)
        )}
      </div>
      <span className="sr-only">
        {title} ({items.length}) <Icon className="inline" />
      </span>
    </ScrollArea>
  );
}

export default function ConversationSidebar({ convos, currentUserId, activeId }: Props) {
  const buying = convos.filter((c) => c.customer_id === currentUserId);
  const selling = convos.filter((c) => c.vendor_id === currentUserId);
  const unread = convos.filter((c) => c.unread > 0);

  const defaultOpen = ["unread", "buying", "selling"].filter((k) =>
    k === "unread" ? unread.length > 0 : k === "buying" ? buying.length > 0 : selling.length > 0
  );
  const openValues = defaultOpen.length > 0 ? defaultOpen : ["buying"];

  return (
    <aside className="bg-white md:rounded-2xl md:border md:border-bk-beige overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-bk-beige flex items-center gap-2 flex-shrink-0">
        <MessageSquare className="w-4 h-4 text-bk-muted" />
        <h2 className="text-[15px] font-bold text-bk-dark">Messages</h2>
        {unread.length > 0 && (
          <span className="ml-auto bg-bk-yellow text-bk-dark text-[10px] font-bold rounded-full px-1.5 h-[18px] flex items-center">
            {unread.reduce((n, c) => n + c.unread, 0)}
          </span>
        )}
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={openValues} className="px-2 py-1">
          <AccordionItem value="unread" className="border-b-0">
            <AccordionTrigger className="px-2 py-2 text-[12px] font-bold uppercase tracking-wider text-bk-muted hover:no-underline">
              <span className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5" /> Unread
                <span className="text-bk-dark">({unread.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <Section title="Unread" icon={Inbox} items={unread} activeId={activeId} emptyText="No unread messages." />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="buying" className="border-b-0">
            <AccordionTrigger className="px-2 py-2 text-[12px] font-bold uppercase tracking-wider text-bk-muted hover:no-underline">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Buying
                <span className="text-bk-dark">({buying.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <Section title="Buying" icon={ShoppingBag} items={buying} activeId={activeId} emptyText="You haven't started any chats yet." />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="selling" className="border-b-0">
            <AccordionTrigger className="px-2 py-2 text-[12px] font-bold uppercase tracking-wider text-bk-muted hover:no-underline">
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5" /> Selling
                <span className="text-bk-dark">({selling.length})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <Section title="Selling" icon={Store} items={selling} activeId={activeId} emptyText="No buyer messages yet." />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
