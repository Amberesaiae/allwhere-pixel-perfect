import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { User, Store } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);

  return (
    <header className="sticky top-0 z-50 bg-bk-cream/95 backdrop-blur-sm border-b border-bk-beige">
      <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bk-dark flex items-center justify-center">
            <span className="text-bk-cream font-bold text-sm">BK</span>
          </div>
          <span className="text-xl font-bold text-bk-dark">BlueKiosk</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition" activeProps={{ className: "text-bk-dark font-semibold" }}>
            Home
          </Link>
          <Link to="/discover" className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition" activeProps={{ className: "text-bk-dark font-semibold" }}>
            Discover
          </Link>
          {!isLoading && !rolesLoading && isAuthenticated && isVendor && (
            <Link to="/dashboard" className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition" activeProps={{ className: "text-bk-dark font-semibold" }}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <CartDrawer />
          {!isLoading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                {!rolesLoading && !isVendor && (
                  <Link
                    to="/become-vendor"
                    className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-bk-dark border border-bk-dark px-4 py-2 rounded-full hover:bg-bk-beige transition"
                  >
                    <Store className="w-3.5 h-3.5" /> Sell
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-[14px] font-medium text-bk-dark hover:text-bk-muted transition"
                >
                  <div className="w-8 h-8 rounded-full bg-bk-beige flex items-center justify-center">
                    <User className="w-4 h-4 text-bk-dark" />
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-bk-dark hover:text-bk-muted transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-[14px] font-semibold bg-bk-yellow text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-yellow-hover transition"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
