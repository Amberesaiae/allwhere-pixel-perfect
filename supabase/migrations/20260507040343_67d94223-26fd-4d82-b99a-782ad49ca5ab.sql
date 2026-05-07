-- Enums
CREATE TYPE public.order_status AS ENUM (
  'pending_payment','paid_held','shipped','delivered','released','refunded','disputed','cancelled'
);
CREATE TYPE public.transaction_type AS ENUM ('payment','release','refund');

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  kiosk_id uuid NOT NULL,
  buyer_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  currency text NOT NULL DEFAULT 'GHS',
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  delivery_name text,
  delivery_phone text,
  delivery_address text,
  delivery_city text,
  delivery_region text,
  notes text,
  tracking_note text,
  conversation_id uuid,
  paid_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  released_at timestamptz,
  auto_release_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_vendor ON public.orders(vendor_id);
CREATE INDEX idx_orders_status ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyer or vendor or admin can view orders"
ON public.orders FOR SELECT TO authenticated
USING (
  auth.uid() = buyer_id
  OR auth.uid() = vendor_id
  OR has_role(auth.uid(),'admin'::app_role)
);

CREATE POLICY "Buyer can create orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyer vendor or admin can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (
  auth.uid() = buyer_id
  OR auth.uid() = vendor_id
  OR has_role(auth.uid(),'admin'::app_role)
)
WITH CHECK (
  auth.uid() = buyer_id
  OR auth.uid() = vendor_id
  OR has_role(auth.uid(),'admin'::app_role)
);

-- Transactions
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'GHS',
  status text NOT NULL DEFAULT 'success',
  provider text NOT NULL DEFAULT 'blupay_mock',
  provider_ref text,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_order ON public.transactions(order_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants or admin can view transactions"
ON public.transactions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = transactions.order_id
      AND (auth.uid() = o.buyer_id OR auth.uid() = o.vendor_id OR has_role(auth.uid(),'admin'::app_role))
  )
);

CREATE POLICY "Order participants or admin can insert transactions"
ON public.transactions FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = transactions.order_id
      AND (auth.uid() = o.buyer_id OR auth.uid() = o.vendor_id OR has_role(auth.uid(),'admin'::app_role))
  )
);

-- updated_at trigger
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- status side-effects: stamp timestamps + set auto_release_at
CREATE OR REPLACE FUNCTION public.orders_status_side_effects()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status) OR TG_OP = 'INSERT' THEN
    IF NEW.status = 'paid_held' AND NEW.paid_at IS NULL THEN
      NEW.paid_at := now();
      NEW.auto_release_at := now() + interval '7 days';
    ELSIF NEW.status = 'shipped' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at := now();
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
      -- shorten auto-release window once delivered
      NEW.auto_release_at := LEAST(COALESCE(NEW.auto_release_at, now() + interval '3 days'), now() + interval '3 days');
    ELSIF NEW.status = 'released' AND NEW.released_at IS NULL THEN
      NEW.released_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_status_side_effects
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.orders_status_side_effects();

-- System message in conversation on order create / status change
CREATE OR REPLACE FUNCTION public.orders_post_system_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  body_text text;
BEGIN
  IF NEW.conversation_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    body_text := 'Order placed · awaiting payment';
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    body_text := 'Order status: ' || NEW.status::text;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.messages (conversation_id, sender_id, body, message_type, transaction_id)
  VALUES (NEW.conversation_id, NEW.buyer_id, body_text, 'system', NEW.id);

  UPDATE public.conversations SET last_message_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_post_system_message
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.orders_post_system_message();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;