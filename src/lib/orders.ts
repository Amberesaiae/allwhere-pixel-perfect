import { supabase } from "@/integrations/supabase/client";
import { getOrCreateConversation } from "@/lib/chat";

export type OrderStatus =
  | "pending_payment"
  | "paid_held"
  | "shipped"
  | "delivered"
  | "released"
  | "refunded"
  | "disputed"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  paid_held: "Paid · in escrow",
  shipped: "Shipped",
  delivered: "Delivered",
  released: "Released to seller",
  refunded: "Refunded",
  disputed: "Disputed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-50 text-amber-700",
  paid_held: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  released: "bg-green-50 text-green-700",
  refunded: "bg-zinc-100 text-zinc-700",
  disputed: "bg-red-50 text-red-700",
  cancelled: "bg-zinc-100 text-zinc-600",
};

export interface CreateOrderInput {
  listingId: string;
  kioskId: string;
  buyerId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  delivery: {
    name: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    notes?: string;
  };
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const conversationId = await getOrCreateConversation({
    customerId: input.buyerId,
    vendorId: input.vendorId,
    kioskId: input.kioskId,
    listingId: input.listingId,
  });

  const total = input.quantity * input.unitPrice;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      listing_id: input.listingId,
      kiosk_id: input.kioskId,
      buyer_id: input.buyerId,
      vendor_id: input.vendorId,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      total_amount: total,
      currency: input.currency,
      delivery_name: input.delivery.name,
      delivery_phone: input.delivery.phone,
      delivery_address: input.delivery.address,
      delivery_city: input.delivery.city,
      delivery_region: input.delivery.region,
      notes: input.delivery.notes ?? null,
      conversation_id: conversationId,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not create order.");
  return data.id;
}

/**
 * Mock BluPay payment. In production this would redirect to a PSP and
 * a webhook would mark the order paid_held. Here we simulate success.
 */
export async function mockPayOrder(orderId: string, buyerId: string): Promise<void> {
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .select("id, total_amount, currency")
    .eq("id", orderId)
    .single();
  if (oErr || !order) throw new Error(oErr?.message ?? "Order not found.");

  const { error: tErr } = await supabase.from("transactions").insert({
    order_id: order.id,
    type: "payment",
    amount: order.total_amount,
    currency: order.currency,
    status: "success",
    provider: "blupay_mock",
    provider_ref: `MOCK-${Date.now()}`,
    created_by: buyerId,
    note: "Mock checkout — funds held in escrow",
  });
  if (tErr) throw new Error(tErr.message);

  const { error: uErr } = await supabase
    .from("orders")
    .update({ status: "paid_held" })
    .eq("id", orderId);
  if (uErr) throw new Error(uErr.message);
}

export async function markShipped(orderId: string, trackingNote?: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status: "shipped", tracking_note: trackingNote ?? null })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function markDelivered(orderId: string) {
  const { error } = await supabase.from("orders").update({ status: "delivered" }).eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function releaseFunds(orderId: string, vendorId: string) {
  const { data: order, error: oErr } = await supabase
    .from("orders")
    .select("id, total_amount, currency")
    .eq("id", orderId)
    .single();
  if (oErr || !order) throw new Error(oErr?.message ?? "Order not found.");

  const { error: tErr } = await supabase.from("transactions").insert({
    order_id: order.id,
    type: "release",
    amount: order.total_amount,
    currency: order.currency,
    status: "success",
    provider: "blupay_mock",
    provider_ref: `REL-${Date.now()}`,
    created_by: vendorId,
    note: "Funds released to seller",
  });
  if (tErr) throw new Error(tErr.message);

  const { error: uErr } = await supabase.from("orders").update({ status: "released" }).eq("id", orderId);
  if (uErr) throw new Error(uErr.message);
}

export async function disputeOrder(orderId: string, reason: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status: "disputed", tracking_note: reason })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function cancelOrder(orderId: string) {
  const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
  if (error) throw new Error(error.message);
}
