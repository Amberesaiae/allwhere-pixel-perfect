-- Add review tracking columns to reports
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolution_note text;

-- Trigger: stamp reviewer info when status changes away from 'open'
CREATE OR REPLACE FUNCTION public.stamp_report_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.reviewed_by := auth.uid();
    NEW.reviewed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_stamp_report_review ON public.reports;
CREATE TRIGGER trg_stamp_report_review
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.stamp_report_review();

-- Admin moderation policies on listings & kiosks
CREATE POLICY "Admins can update any listing"
ON public.listings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any kiosk"
ON public.kiosks FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status, created_at DESC);