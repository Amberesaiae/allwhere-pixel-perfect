import { useState } from "react";
import { X, ExternalLink, Loader2, Ban, CheckCircle, Eye, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ReportRowData } from "./ReportRow";

interface Props {
  report: ReportRowData;
  onClose: () => void;
  onChanged: () => void;
}

export default function ReportDetailPanel({ report, onClose, onChanged }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState(report.details ?? "");

  const updateStatus = async (status: string) => {
    setBusy(status);
    const { error } = await supabase
      .from("reports")
      .update({ status, resolution_note: note || null })
      .eq("id", report.id);
    setBusy(null);
    if (error) {
      toast.error("Could not update report.");
      return;
    }
    toast.success(`Report marked as ${status}.`);
    onChanged();
  };

  const suspendTarget = async () => {
    setBusy("suspend");
    const table = report.target_type === "listing" ? "listings" : "kiosks";
    const { error } = await supabase.from(table).update({ status: "suspended" }).eq("id", report.target_id);
    setBusy(null);
    if (error) {
      toast.error(`Could not suspend ${report.target_type}.`);
      return;
    }
    toast.success(`${report.target_type === "listing" ? "Listing" : "Kiosk"} suspended.`);
    await updateStatus("resolved");
  };

  const slug = report.target.type !== "unknown" ? report.target.slug : null;
  const targetUrl =
    report.target.type === "listing" && slug
      ? `/listing/${slug}`
      : report.target.type === "kiosk" && slug
      ? `/kiosk/${slug}`
      : null;

  return (
    <aside className="bg-white rounded-2xl border border-bk-beige p-5 sticky top-24">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[15px] font-bold text-bk-dark">Report details</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-bk-page flex items-center justify-center" aria-label="Close">
          <X className="w-4 h-4 text-bk-muted" />
        </button>
      </div>

      {/* Target preview */}
      <div className="bg-bk-page rounded-xl p-3 mb-4">
        <p className="text-[10px] uppercase font-bold text-bk-muted mb-1">{report.target_type}</p>
        <p className="text-[14px] font-semibold text-bk-dark mb-2">{report.target.title}</p>
        {targetUrl && (
          <Link to={targetUrl} target="_blank" className="inline-flex items-center gap-1 text-[12px] font-semibold text-bk-dark hover:underline">
            View public page <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Report info */}
      <div className="space-y-3 mb-4 text-[13px]">
        <div>
          <p className="text-[11px] uppercase font-bold text-bk-muted mb-0.5">Reason</p>
          <p className="text-bk-dark">{report.reason}</p>
        </div>
        {report.details && (
          <div>
            <p className="text-[11px] uppercase font-bold text-bk-muted mb-0.5">Reporter details</p>
            <p className="text-bk-dark whitespace-pre-wrap">{report.details}</p>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase font-bold text-bk-muted mb-0.5">Reporter</p>
          <p className="text-bk-dark">{report.reporter_name ?? "Anonymous"}</p>
        </div>
      </div>

      {/* Resolution note */}
      <label className="block text-[11px] uppercase font-bold text-bk-muted mb-1.5">Resolution note (optional)</label>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Internal note for this decision..."
        className="w-full px-3 py-2 rounded-xl border border-bk-beige bg-bk-page text-bk-dark text-[13px] mb-4 focus:outline-none focus:ring-2 focus:ring-bk-yellow resize-none"
      />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <ActionBtn busy={busy === "reviewing"} disabled={!!busy || report.status === "reviewing"} onClick={() => updateStatus("reviewing")} icon={Eye}>
          Reviewing
        </ActionBtn>
        <ActionBtn busy={busy === "resolved"} disabled={!!busy} onClick={() => updateStatus("resolved")} icon={CheckCircle} variant="primary">
          Resolve
        </ActionBtn>
        <ActionBtn busy={busy === "dismissed"} disabled={!!busy} onClick={() => updateStatus("dismissed")} icon={XCircle}>
          Dismiss
        </ActionBtn>
        <ActionBtn busy={busy === "suspend"} disabled={!!busy} onClick={suspendTarget} icon={Ban} variant="danger">
          Suspend {report.target_type}
        </ActionBtn>
      </div>

      {report.status !== "open" && (
        <p className="text-[11px] text-bk-muted mt-3 text-center">
          Last updated when status changed.
        </p>
      )}
    </aside>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  busy,
  icon: Icon,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "primary" | "danger";
}) {
  const base = "inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold py-2 rounded-full transition disabled:opacity-50";
  const styles = {
    default: "border border-bk-beige text-bk-dark hover:bg-bk-page",
    primary: "bg-bk-yellow text-bk-dark hover:bg-bk-yellow-hover",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`}>
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}
