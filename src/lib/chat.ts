import { supabase } from "@/integrations/supabase/client";

/**
 * Get or create a 1:1 conversation between the current user (customer) and a vendor,
 * scoped to either a listing (preferred) or a kiosk.
 */
export async function getOrCreateConversation(params: {
  customerId: string;
  vendorId: string;
  kioskId: string;
  listingId?: string | null;
}): Promise<string> {
  const { customerId, vendorId, kioskId, listingId } = params;

  if (customerId === vendorId) {
    throw new Error("You cannot start a conversation with yourself.");
  }

  let query = supabase
    .from("conversations")
    .select("id")
    .eq("customer_id", customerId)
    .eq("vendor_id", vendorId)
    .eq("kiosk_id", kioskId);

  query = listingId ? query.eq("listing_id", listingId) : query.is("listing_id", null);

  const { data: existing } = await query.maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      customer_id: customerId,
      vendor_id: vendorId,
      kiosk_id: kioskId,
      listing_id: listingId ?? null,
    })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Could not start conversation.");
  }
  return created.id;
}

export async function uploadChatAttachment(conversationId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${conversationId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("chat-attachments").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = await supabase.storage.from("chat-attachments").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? path;
}
