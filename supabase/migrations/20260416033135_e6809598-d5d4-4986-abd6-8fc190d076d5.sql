-- Function to promote current user to vendor role
CREATE OR REPLACE FUNCTION public.promote_to_vendor()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if already a vendor
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'vendor') THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'vendor');
  RETURN true;
END;
$$;