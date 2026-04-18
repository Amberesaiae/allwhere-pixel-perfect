import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReportRow, { type ReportRowData, type ReportTarget } from "@/components/admin/ReportRow";
import ReportDetailPanel from "@/components/admin/ReportDetailPanel";
import EmptyState from "@/components/EmptyState";
import { Flag, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — bluekiosk admin" }] }),
  component: AdminReports,
});

const STATUSES = ["open", "reviewing", "resolved", "dismissed"] as const;
type Status = (typeof STATUSES)[number];

function AdminReports() {
  const [reports, setReports] = useState<ReportRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status>("open");
  const [typeFilter, setTypeFilter] = useState<"all" | "listing" | "kiosk">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!rows) {
      setReports([]);
      setLoading(false);
      return;
    }

    // Hydrate target snapshots + reporter names
    const listingIds = rows.filter((r) => r.target_type === "listing").map((r) => r.target_id);
    const kioskIds = rows.filter((r) => r.target_type === "kiosk").map((r) => r.target_id);
    const reporterIds = Array.from(new Set(rows.map((r) => r.reporter_id).filter(Boolean) as string[]));

    const [listingsRes, kiosksRes, profilesRes, imagesRes] = await Promise.all([
      listingIds.length
        ? supabase.from("listings").select("id,title,slug").in("id", listingIds)
        : Promise.resolve({ data: [] as any[] }),
      kioskIds.length
        ? supabase.from("kiosks").select("id,name,slug,cover_image_url").in("id", kioskIds)
        : Promise.resolve({ data: [] as any[] }),
      reporterIds.length
        ? supabase.from("profiles").select("user_id,display_name").in("user_id", reporterIds)
        : Promise.resolve({ data: [] as any[] }),
      listingIds.length
        ? supabase.from("listing_images").select("listing_id,image_url,sort_order").in("listing_id", listingIds).order("sort_order")
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const listingMap = new Map((listingsRes.data ?? []).map((l: any) => [l.id, l]));
    const kioskMap = new Map((kiosksRes.data ?? []).map((k: any) => [k.id, k]));
    const profileMap = new Map((profilesRes.data ?? []).map((p: any) => [p.user_id, p.display_name]));
    const firstImage = new Map<string, string>();
    for (const img of (imagesRes.data ?? []) as any[]) {
      if (!firstImage.has(img.listing_id)) firstImage.set(img.listing_id, img.image_url);
    }

    const hydrated: ReportRowData[] = rows.map((r) => {
      let target: ReportTarget;
      if (r.target_type === "listing") {
        const l = listingMap.get(r.target_id);
        target = l
          ? { type: "listing", title: l.title, slug: l.slug, image: firstImage.get(r.target_id) ?? null }
          : { type: "unknown", title: "Listing deleted" };
      } else if (r.target_type === "kiosk") {
        const k = kioskMap.get(r.target_id);
        target = k
          ? { type: "kiosk", title: k.name, slug: k.slug, image: k.cover_image_url ?? null }
          : { type: "unknown", title: "Kiosk deleted" };
      } else {
        target = { type: "unknown", title: r.target_type };
      }
      return {
        id: r.id,
        status: r.status,
        reason: r.reason,
        details: r.details,
        target_type: r.target_type,
        target_id: r.target_id,
        created_at: r.created_at,
        reporter_name: r.reporter_id ? profileMap.get(r.reporter_id) ?? null : null,
        target,
      };
    });

    setReports(hydrated);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Realtime subscription
    const channel = supabase
      .channel("admin-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { open: 0, reviewing: 0, resolved: 0, dismissed: 0 };
    for (const r of reports) {
      if (r.status in c) c[r.status as Status]++;
    }
    return c;
  }, [reports]);

  const filtered = useMemo(
    () =>
      reports.filter(
        (r) => r.status === statusFilter && (typeFilter === "all" || r.target_type === typeFilter)
      ),
    [reports, statusFilter, typeFilter]
  );

  const selected = filtered.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div>
        {/* Status tabs */}
        <div className="flex gap-1 mb-3 bg-white rounded-full border border-bk-beige p-1 w-fit">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setSelectedId(null); }}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-full transition capitalize ${
                statusFilter === s ? "bg-bk-yellow text-bk-dark" : "text-bk-muted hover:text-bk-dark"
              }`}
            >
              {s} <span className="ml-1 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-1 mb-4 text-[12px]">
          {(["all", "listing", "kiosk"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full font-semibold transition capitalize ${
                typeFilter === t ? "bg-bk-dark text-white" : "text-bk-muted hover:text-bk-dark"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Reports list */}
        <div className="bg-white rounded-2xl border border-bk-beige overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-bk-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Flag}
              title={`No ${statusFilter} reports`}
              description={statusFilter === "open" ? "All caught up. New reports appear here in real time." : `No reports in this status yet.`}
            />
          ) : (
            filtered.map((r) => (
              <ReportRow key={r.id} report={r} selected={r.id === selectedId} onClick={() => setSelectedId(r.id)} />
            ))
          )}
        </div>
      </div>

      <div>
        {selected ? (
          <ReportDetailPanel report={selected} onClose={() => setSelectedId(null)} onChanged={load} />
        ) : (
          <div className="bg-white rounded-2xl border border-bk-beige p-6 text-center text-[13px] text-bk-muted sticky top-24">
            Select a report to view details and take action.
          </div>
        )}
      </div>
    </div>
  );
}
