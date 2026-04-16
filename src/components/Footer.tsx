import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bk-footer text-white pt-14 pb-6 mt-10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-bk-yellow flex items-center justify-center">
                <span className="text-bk-dark font-bold text-[14px]">BK</span>
              </div>
              <span className="text-[18px] font-bold">BlueKiosk</span>
            </div>
            <p className="text-[13px] text-white/70 leading-relaxed max-w-[320px]">
              Ghana's trusted marketplace connecting buyers with verified local vendors. Browse listings, contact sellers via WhatsApp, and shop with confidence.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-bk-yellow hover:text-bk-dark flex items-center justify-center transition" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-bk-yellow hover:text-bk-dark flex items-center justify-center transition" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-bk-yellow hover:text-bk-dark flex items-center justify-center transition" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-[13px] text-white/70">
              <li><Link to="/discover" search={{ category: "electronics", tab: "listings" }} className="hover:text-bk-yellow transition">Electronics</Link></li>
              <li><Link to="/discover" search={{ category: "fashion", tab: "listings" }} className="hover:text-bk-yellow transition">Fashion</Link></li>
              <li><Link to="/discover" search={{ category: "food-groceries", tab: "listings" }} className="hover:text-bk-yellow transition">Food</Link></li>
              <li><Link to="/discover" search={{ category: "services", tab: "listings" }} className="hover:text-bk-yellow transition">Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-[13px] text-white/70">
              <li><Link to="/discover" className="hover:text-bk-yellow transition">Browse</Link></li>
              <li><Link to="/become-vendor" className="hover:text-bk-yellow transition">Sell on BlueKiosk</Link></li>
              <li><Link to="/terms" className="hover:text-bk-yellow transition">Terms & Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-[13px] text-white/70">
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" /><a href="mailto:hello@bluekiosk.com" className="hover:text-bk-yellow transition">hello@bluekiosk.com</a></li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /><span>+233 (0) 00 000 0000</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/60">© {new Date().getFullYear()} BlueKiosk. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-white/60">
            <span className="px-2.5 py-1 rounded bg-white/10">Mobile Money</span>
            <span className="px-2.5 py-1 rounded bg-white/10">Visa</span>
            <span className="px-2.5 py-1 rounded bg-white/10">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
