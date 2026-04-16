import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { User, Store, Menu, X, Heart } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { to: "/" as const, label: "Home" },
    { to: "/discover" as const, label: "Discover" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bk-cream/95 backdrop-blur-sm border-b border-bk-beige">
      <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bk-dark flex items-center justify-center">
            <span className="text-bk-cream font-bold text-sm">BK</span>
          </div>
          <span className="text-xl font-bold text-bk-dark">BlueKiosk</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition"
              activeProps={{ className: "text-bk-dark font-semibold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          {!isLoading && !rolesLoading && isAuthenticated && isVendor && (
            <Link
              to="/dashboard"
              className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition"
              activeProps={{ className: "text-bk-dark font-semibold" }}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop right */}
        <div className="flex items-center gap-3">
          {!isLoading && isAuthenticated && (
            <Link
              to="/favorites"
              className="p-2 text-bk-muted hover:text-bk-dark transition"
              title="Saved listings"
            >
              <Heart className="w-5 h-5" />
            </Link>
          )}
          <CartDrawer />
          {!isLoading && (
            isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {!rolesLoading && !isVendor && (
                  <Link
                    to="/become-vendor"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-bk-dark border border-bk-dark px-4 py-2 rounded-full hover:bg-bk-beige transition"
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
              <div className="hidden md:flex items-center gap-3">
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
              </div>
            )
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-bk-dark"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bk-cream border-t border-bk-beige">
          <nav className="mx-auto max-w-[1280px] px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className="block py-3 text-[15px] font-medium text-bk-muted hover:text-bk-dark transition border-b border-bk-beige/50"
                activeProps={{ className: "text-bk-dark font-semibold" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && isAuthenticated && (
              <Link
                to="/favorites"
                onClick={closeMobile}
                className="block py-3 text-[15px] font-medium text-bk-muted hover:text-bk-dark transition border-b border-bk-beige/50"
                activeProps={{ className: "text-bk-dark font-semibold" }}
              >
                Saved
              </Link>
            )}

            {!isLoading && !rolesLoading && isAuthenticated && isVendor && (
              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="block py-3 text-[15px] font-medium text-bk-muted hover:text-bk-dark transition border-b border-bk-beige/50"
                activeProps={{ className: "text-bk-dark font-semibold" }}
              >
                Dashboard
              </Link>
            )}

            {!isLoading && (
              isAuthenticated ? (
                <>
                  {!rolesLoading && !isVendor && (
                    <Link
                      to="/become-vendor"
                      onClick={closeMobile}
                      className="block py-3 text-[15px] font-medium text-bk-muted hover:text-bk-dark transition border-b border-bk-beige/50"
                    >
                      Start Selling
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="block py-3 text-[15px] font-medium text-bk-muted hover:text-bk-dark transition"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <div className="flex gap-3 pt-3">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex-1 text-center text-[14px] font-medium text-bk-dark border border-bk-dark py-3 rounded-full hover:bg-bk-beige transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="flex-1 text-center text-[14px] font-semibold bg-bk-yellow text-bk-dark py-3 rounded-full hover:bg-bk-yellow-hover transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
