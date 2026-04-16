import { Link } from "@tanstack/react-router";
import { Home, Search, Plus, Store, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function MobileBottomNav() {
  const { isAuthenticated, user } = useAuth();
  const { isVendor } = useUserRoles(user?.id);

  const sellTo = !isAuthenticated ? "/register" : isVendor ? "/dashboard/create-listing" : "/become-vendor";

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-bk-beige h-16 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
      <Link to="/" className="flex flex-col items-center gap-0.5 text-bk-muted" activeProps={{ className: "text-bk-dark" }} activeOptions={{ exact: true }}>
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link to="/discover" search={{ tab: "listings", category: "", q: "" }} className="flex flex-col items-center gap-0.5 text-bk-muted" activeProps={{ className: "text-bk-dark" }}>
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium">Discover</span>
      </Link>
      <Link
        to={sellTo}
        className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-full bg-bk-yellow text-bk-dark shadow-lg hover:bg-bk-yellow-hover transition"
        title="Sell"
      >
        <Plus className="w-6 h-6" />
      </Link>
      <Link to="/discover" search={{ tab: "kiosks", category: "", q: "" }} className="flex flex-col items-center gap-0.5 text-bk-muted" activeProps={{ className: "text-bk-dark" }}>
        <Store className="w-5 h-5" />
        <span className="text-[10px] font-medium">Kiosks</span>
      </Link>
      <Link to={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center gap-0.5 text-bk-muted" activeProps={{ className: "text-bk-dark" }}>
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">{isAuthenticated ? "Profile" : "Sign in"}</span>
      </Link>
    </nav>
  );
}
