import { formatDistanceToNow } from "date-fns";
import { Flag, ShoppingBag, Store } from "lucide-react";

export type ReportTarget =
  | { type: "listing"; title: string; image?: string | null; slug?: string | null }
  | { type: "kiosk"; title: string; image?: string | null; slug?: string | null }
  | { type: "unknown"; title: string };

export interface ReportRowData {
  id: string;
  status: string;
  reason: string;
  details: string | null;
  target_type: string;
  target_id: string;
  created_at: string;
  reporter_name: string | null;
  target: ReportTarget;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  reviewing: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  dismissed: "bg-bk-beige text-bk-muted",
};

export default function ReportRow({
  report,
  selected,
  onClick,
}: {
  report: ReportRowData;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = report.target.type === "listing" ? ShoppingBag : report.target.type === "kiosk" ? Store : Flag;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-bk-beige hover:bg-bk-page transition ${selected ? "bg-bk-page" : "bg-white"}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-bk-page flex items-center justify-center flex-shrink-0 overflow-hidden">
          {report.target.type !== "unknown" && report.target.image ? (
            <img src={report.target.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <Icon className="w-4 h-4 text-bk-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[13px] font-semibold text-bk-dark truncate">{report.target.title}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[report.status] ?? "bg-bk-beige text-bk-muted"}`}>
              {report.status}
            </span>
          </div>
          <p className="text-[12px] text-bk-dark mb-1 line-clamp-1"><span className="font-medium">{report.reason}</span></p>
          <div className="flex items-center gap-2 text-[11px] text-bk-muted">
            <span>{report.reporter_name ?? "Anonymous"}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
