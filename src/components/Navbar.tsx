import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Search, Heart, User, Menu, X, ChevronDown, Plus, MessageSquare } from "lucide-react";
import { useState } from "react";
import CategoryStrip from "@/components/CategoryStrip";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isVendor, isAdmin, loading: rolesLoading } = useUserRoles(user?.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const sellTo = !isAuthenticated ? "/register" : isVendor ? "/dashboard/create-listing" : "/become-vendor";
  const closeMobile = () => setMobileOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/discover",
      search: { tab: "listings", category: "", q: query.trim() },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Row 1 */}
      <div className="border-b border-bk-beige">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 flex items-center gap-3 md:gap-6 h-16 md:h-20">
          {/* Logo */}
          <BrandLogo size={22} withTagline className="md:scale-110 md:origin-left" />

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[640px] hidden sm:block">
            <div className="relative flex items-center bg-bk-page rounded-full border border-bk-beige focus-within:border-bk-yellow focus-within:ring-2 focus-within:ring-bk-yellow/30 transition pl-4 pr-1 h-11">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search listings, kiosks, products..."
                className="flex-1 bg-transparent outline-none text-[14px] text-bk-dark placeholder:text-bk-muted"
              />
              <button type="submit" className="w-9 h-9 rounded-full bg-bk-yellow hover:bg-bk-yellow-hover flex items-center justify-center transition" aria-label="Search">
                <Search className="w-4 h-4 text-bk-dark" />
              </button>
            </div>
          </form>

          {/* Right cluster */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto sm:ml-0">
            {!isLoading && isAuthenticated && (
              <>
                <ChatBell userId={user?.id} />
                <Link to="/favorites" className="hidden sm:flex w-10 h-10 rounded-full hover:bg-bk-page items-center justify-center text-bk-dark transition" title="Saved">
                  <Heart className="w-5 h-5" />
                </Link>
              </>
            )}
            {!isLoading && (
              isAuthenticated ? (
                <Link to="/profile" className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-bk-page transition" title="Account">
                  <div className="w-8 h-8 rounded-full bg-bk-beige flex items-center justify-center">
                    <User className="w-4 h-4 text-bk-dark" />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-bk-muted" />
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:inline-block text-[13px] font-semibold text-bk-dark px-3 py-2 rounded-full hover:bg-bk-page transition">
                  Sign in
                </Link>
              )
            )}
            {!isLoading && !rolesLoading && (
              <Link
                to={sellTo}
                className="inline-flex items-center gap-1.5 text-[13px] md:text-[14px] font-bold bg-bk-yellow text-bk-dark px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-bk-yellow-hover transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Sell
              </Link>
            )}
            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden w-10 h-10 flex items-center justify-center text-bk-dark" aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
          <div className="relative flex items-center bg-bk-page rounded-full border border-bk-beige pl-4 pr-1 h-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent outline-none text-[13px] text-bk-dark placeholder:text-bk-muted"
            />
            <button type="submit" className="w-8 h-8 rounded-full bg-bk-yellow flex items-center justify-center" aria-label="Search">
              <Search className="w-4 h-4 text-bk-dark" />
            </button>
          </div>
        </form>
      </div>

      {/* Row 2: Category strip */}
      <CategoryStrip />

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-bk-beige">
          <div className="mx-auto max-w-[1280px] px-4 py-3 space-y-1">
            <Link to="/" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Home</Link>
            <Link to="/discover" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Discover</Link>
            {isAuthenticated && (
              <>
                <Link to="/chat" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Messages</Link>
                <Link to="/favorites" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Saved</Link>
                <Link to="/orders" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Orders</Link>
                {isVendor && <Link to="/dashboard" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Dashboard</Link>}
                {isVendor && <Link to="/dashboard/orders" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Vendor orders</Link>}
                {isAdmin && <Link to="/admin/reports" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark border-b border-bk-beige/50">Admin</Link>}
                <Link to="/profile" onClick={closeMobile} className="block py-2.5 text-[14px] font-medium text-bk-dark">Profile</Link>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={closeMobile} className="flex-1 text-center text-[13px] font-medium border border-bk-dark text-bk-dark py-2.5 rounded-full">Sign in</Link>
                <Link to="/register" onClick={closeMobile} className="flex-1 text-center text-[13px] font-bold bg-bk-yellow text-bk-dark py-2.5 rounded-full">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function ChatBell({ userId }: { userId: string | undefined }) {
  const unread = useUnreadMessages(userId);
  return (
    <Link to="/chat" className="hidden sm:flex relative w-10 h-10 rounded-full hover:bg-bk-page items-center justify-center text-bk-dark transition" title="Messages">
      <MessageSquare className="w-5 h-5" />
      {unread > 0 && (
        <span className="absolute top-1 right-1 bg-bk-yellow text-bk-dark text-[10px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
