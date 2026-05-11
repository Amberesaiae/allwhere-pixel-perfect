-- Add dispute fields to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS dispute_reason text,
  ADD COLUMN IF NOT EXISTS dispute_opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS dispute_resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS dispute_resolution text,
  ADD COLUMN IF NOT EXISTS dispute_resolved_by uuid;

-- Update side-effect trigger to stamp dispute_opened_at and resolution timestamps
CREATE OR REPLACE FUNCTION public.orders_status_side_effects()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status) OR TG_OP = 'INSERT' THEN
    IF NEW.status = 'paid_held' AND NEW.paid_at IS NULL THEN
      NEW.paid_at := now();
      NEW.auto_release_at := now() + interval '7 days';
    ELSIF NEW.status = 'shipped' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at := now();
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
      NEW.auto_release_at := LEAST(COALESCE(NEW.auto_release_at, now() + interval '3 days'), now() + interval '3 days');
    ELSIF NEW.status = 'released' AND NEW.released_at IS NULL THEN
      NEW.released_at := now();
    ELSIF NEW.status = 'disputed' AND NEW.dispute_opened_at IS NULL THEN
      NEW.dispute_opened_at := now();
      NEW.auto_release_at := NULL; -- freeze auto-release while disputed
    ELSIF NEW.status IN ('refunded') AND NEW.dispute_resolved_at IS NULL AND OLD.status = 'disputed' THEN
      NEW.dispute_resolved_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Idempotency helper for transactions: prevent duplicate auto-release
CREATE UNIQUE INDEX IF NOT EXISTS transactions_unique_release_per_order
  ON public.transactions(order_id, type)
  WHERE type = 'release';
