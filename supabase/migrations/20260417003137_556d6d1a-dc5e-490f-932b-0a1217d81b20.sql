-- Wave 2: Saved kiosks (kiosk_favorites) and reports table
CREATE TABLE public.kiosk_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kiosk_id UUID NOT NULL REFERENCES public.kiosks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, kiosk_id)
);

ALTER TABLE public.kiosk_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own kiosk favorites"
ON public.kiosk_favorites FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add kiosk favorites"
ON public.kiosk_favorites FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove kiosk favorites"
ON public.kiosk_favorites FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_kiosk_favorites_user ON public.kiosk_favorites(user_id);

-- Reports table for listings/kiosks abuse reporting
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing','kiosk')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can submit reports"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

CREATE POLICY "Admins can view reports"
ON public.reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.reports FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);