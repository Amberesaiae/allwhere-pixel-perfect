import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnreadMessages(userId: string | undefined) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    let cancelled = false;

    const refresh = async () => {
      // Get all conversations the user participates in
      const { data: convos } = await supabase
        .from("conversations")
        .select("id")
        .or(`customer_id.eq.${userId},vendor_id.eq.${userId}`);
      if (!convos || convos.length === 0) {
        if (!cancelled) setCount(0);
        return;
      }
      const ids = convos.map((c) => c.id);
      const { count: unread } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("conversation_id", ids)
        .neq("sender_id", userId)
        .is("read_at", null);
      if (!cancelled) setCount(unread ?? 0);
    };

    refresh();
    const channel = supabase
      .channel(`unread-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, refresh)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return count;
}
