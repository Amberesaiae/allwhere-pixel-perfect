import { useState } from "react";
import { X, Flag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  subject: string;
  targetType: "listing" | "kiosk";
  targetId: string;
}

const REASONS = [
  "Item is fake or counterfeit",
  "Suspicious / scam",
  "Wrong category",
  "Prohibited or illegal item",
  "Offensive content",
  "Other",
];

export default function ReportDialog({ open, onClose, subject, targetType, targetId }: Props) {
  const { user } = useAuth();
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const submit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("reports").insert({
      reporter_id: user?.id ?? null,
      target_type: targetType,
      target_id: targetId,
      reason,
      details: details || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit report. Please try again.");
      return;
    }
    toast.success("Report submitted. Thank you for keeping bluekiosk safe.");
    setDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bk-dark/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-bk-dark inline-flex items-center gap-2">
            <Flag className="w-4 h-4" /> Report this
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bk-page flex items-center justify-center">
            <X className="w-4 h-4 text-bk-dark" />
          </button>
        </div>
        <p className="text-[13px] text-bk-muted mb-4">Help us keep bluekiosk safe. Tell us what's wrong with "{subject}".</p>

        <label className="block text-[13px] font-semibold text-bk-dark mb-1.5">Reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-bk-beige bg-bk-page text-bk-dark text-[14px] mb-4 focus:outline-none focus:ring-2 focus:ring-bk-yellow"
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label className="block text-[13px] font-semibold text-bk-dark mb-1.5">Details (optional)</label>
        <textarea
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-bk-beige bg-bk-page text-bk-dark text-[14px] mb-4 focus:outline-none focus:ring-2 focus:ring-bk-yellow resize-none"
          placeholder="Tell us more..."
        />

        <div className="flex gap-2">
          <button onClick={onClose} disabled={submitting} className="flex-1 text-[13px] font-semibold border border-bk-beige text-bk-dark py-2.5 rounded-full hover:bg-bk-page transition disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-bold bg-bk-yellow text-bk-dark py-2.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
}
