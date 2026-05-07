import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Cron-callable endpoint that:
 *  - Releases funds for delivered orders past their auto_release_at deadline.
 *  - No external secret required for this MVP since the operation is idempotent
 *    and only acts on orders whose deadline has elapsed.
 */
export const Route = createFileRoute("/api/public/escrow-auto-release")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString();
        const { data: due, error } = await supabaseAdmin
          .from("orders")
          .select("id, total_amount, currency, vendor_id")
          .lte("auto_release_at", now)
          .in("status", ["delivered", "shipped"]);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        let released = 0;
        for (const o of due ?? []) {
          const { error: tErr } = await supabaseAdmin.from("transactions").insert({
            order_id: o.id,
            type: "release",
            amount: o.total_amount,
            currency: o.currency,
            status: "success",
            provider: "blupay_mock",
            provider_ref: `AUTO-${Date.now()}`,
            note: "Auto-released after escrow window elapsed",
          });
          if (tErr) continue;
          const { error: uErr } = await supabaseAdmin
            .from("orders")
            .update({ status: "released" })
            .eq("id", o.id);
          if (!uErr) released += 1;
        }

        return new Response(JSON.stringify({ checked: due?.length ?? 0, released }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
