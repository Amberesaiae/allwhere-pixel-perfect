import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-aw-cream/95 backdrop-blur-sm border-b border-aw-beige">
      <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-[72px]">
        <Link to="/" className="text-[22px] font-bold tracking-tight text-aw-dark">
          allwhere
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link to="/how-remote-first-setups-work" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            how it works
          </Link>
          <button className="flex items-center gap-1 text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            use cases <ChevronDown className="w-4 h-4" />
          </button>
          <a href="#" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            laptop retrieval
          </a>
          <Link to="/pricing" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            pricing
          </Link>
          <button className="flex items-center gap-1 text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            resources <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#"
            className="text-[14px] font-semibold text-aw-dark px-5 py-2.5 rounded-full border border-aw-dark/20 hover:bg-aw-beige transition"
          >
            LOGIN
          </a>
          <Link
            to="/contact"
            className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-5 py-2.5 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </Link>
        </div>

        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-aw-cream border-t border-aw-beige px-6 py-6 flex flex-col gap-4">
          <Link to="/how-remote-first-setups-work" className="text-[15px] font-medium text-aw-dark" onClick={() => setMobileOpen(false)}>how it works</Link>
          <a href="#" className="text-[15px] font-medium text-aw-dark">use cases</a>
          <a href="#" className="text-[15px] font-medium text-aw-dark">laptop retrieval</a>
          <Link to="/pricing" className="text-[15px] font-medium text-aw-dark" onClick={() => setMobileOpen(false)}>pricing</Link>
          <a href="#" className="text-[15px] font-medium text-aw-dark">resources</a>
          <div className="flex gap-3 mt-2">
            <a href="#" className="text-[14px] font-semibold text-aw-dark px-5 py-2.5 rounded-full border border-aw-dark/20">LOGIN</a>
            <Link to="/contact" className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-5 py-2.5 rounded-full" onClick={() => setMobileOpen(false)}>GET STARTED</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
