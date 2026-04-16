import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";

export default function Navbar() {
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
          <Link to="/terms" className="text-[14px] font-medium text-bk-muted hover:text-bk-dark transition" activeProps={{ className: "text-bk-dark font-semibold" }}>
            Terms
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartDrawer />
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
      </div>
    </header>
  );
}
