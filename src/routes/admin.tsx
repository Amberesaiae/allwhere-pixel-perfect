import { createFileRoute, Outlet, redirect, Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Flag, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/admin/reports" } });
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const tabs = [
    { to: "/admin/reports", label: "Reports", icon: Flag },
  ];

  return (
    <div className="min-h-screen bg-bk-page">
      <header className="bg-white border-b border-bk-beige">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-bk-muted hover:text-bk-dark transition" aria-label="Back to site">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-bk-yellow" />
            <h1 className="text-[18px] font-bold text-bk-dark">bluekiosk admin</h1>
          </div>
        </div>
        <nav className="mx-auto max-w-[1280px] px-4 md:px-6 flex gap-1 -mb-px">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = location.pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition ${
                  active ? "border-bk-yellow text-bk-dark" : "border-transparent text-bk-muted hover:text-bk-dark"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 md:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
