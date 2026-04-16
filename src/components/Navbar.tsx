import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-aw-cream/95 backdrop-blur-sm border-b border-aw-beige">
      <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a href="/" className="text-[22px] font-bold tracking-tight text-aw-dark">
          allwhere
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            how it works
          </a>
          <button className="flex items-center gap-1 text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            use cases <ChevronDown className="w-4 h-4" />
          </button>
          <a href="#" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            laptop retrieval
          </a>
          <a href="#" className="text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            pricing
          </a>
          <button className="flex items-center gap-1 text-[15px] font-medium text-aw-dark hover:opacity-70 transition">
            resources <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#"
            className="text-[14px] font-semibold text-aw-dark px-5 py-2.5 rounded-full border border-aw-dark/20 hover:bg-aw-beige transition"
          >
            LOGIN
          </a>
          <a
            href="#"
            className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-5 py-2.5 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-aw-cream border-t border-aw-beige px-6 py-6 flex flex-col gap-4">
          <a href="#" className="text-[15px] font-medium text-aw-dark">how it works</a>
          <a href="#" className="text-[15px] font-medium text-aw-dark">use cases</a>
          <a href="#" className="text-[15px] font-medium text-aw-dark">laptop retrieval</a>
          <a href="#" className="text-[15px] font-medium text-aw-dark">pricing</a>
          <a href="#" className="text-[15px] font-medium text-aw-dark">resources</a>
          <div className="flex gap-3 mt-2">
            <a href="#" className="text-[14px] font-semibold text-aw-dark px-5 py-2.5 rounded-full border border-aw-dark/20">LOGIN</a>
            <a href="#" className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-5 py-2.5 rounded-full">GET STARTED</a>
          </div>
        </div>
      )}
    </nav>
  );
}
