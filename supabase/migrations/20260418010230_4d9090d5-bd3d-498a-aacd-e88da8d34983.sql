-- Conversations
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  kiosk_id uuid NOT NULL REFERENCES public.kiosks(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conversations_distinct CHECK (customer_id <> vendor_id)
);

CREATE UNIQUE INDEX uniq_conversation_listing_pair
  ON public.conversations(listing_id, customer_id, vendor_id)
  WHERE listing_id IS NOT NULL;

CREATE UNIQUE INDEX uniq_conversation_kiosk_pair
  ON public.conversations(kiosk_id, customer_id, vendor_id)
  WHERE listing_id IS NULL;

CREATE INDEX idx_conversations_customer ON public.conversations(customer_id, last_message_at DESC);
CREATE INDEX idx_conversations_vendor ON public.conversations(vendor_id, last_message_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their conversations"
ON public.conversations FOR SELECT TO authenticated
USING (auth.uid() = customer_id OR auth.uid() = vendor_id);

CREATE POLICY "Customer can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can update conversation"
ON public.conversations FOR UPDATE TO authenticated
USING (auth.uid() = customer_id OR auth.uid() = vendor_id);

-- Messages
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text,
  attachment_url text,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text','image','system','transaction_card')),
  transaction_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper: is the user a participant in the conversation?
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = _conversation_id
      AND (customer_id = _user_id OR vendor_id = _user_id)
  );
$$;

CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT TO authenticated
USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND public.is_conversation_participant(conversation_id, auth.uid())
);

CREATE POLICY "Participants can mark messages read"
ON public.messages FOR UPDATE TO authenticated
USING (public.is_conversation_participant(conversation_id, auth.uid()));

-- Bump last_message_at on new message
CREATE OR REPLACE FUNCTION public.bump_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_bump_conversation_last_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.bump_conversation_last_message();

-- Realtime
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Storage bucket for chat attachments (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies — folder name is conversation_id
CREATE POLICY "Participants can read chat attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND public.is_conversation_participant(((storage.foldername(name))[1])::uuid, auth.uid())
);

CREATE POLICY "Participants can upload chat attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND public.is_conversation_participant(((storage.foldername(name))[1])::uuid, auth.uid())
);