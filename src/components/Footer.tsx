import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="bg-bk-footer border-t border-bk-beige py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-bk-dark flex items-center justify-center">
                <span className="text-bk-cream font-bold text-sm">BK</span>
              </div>
              <span className="text-xl font-bold text-bk-dark">BlueKiosk</span>
            </div>
            <p className="text-[14px] text-bk-muted leading-relaxed">
              Ghana's trusted marketplace connecting buyers with verified local vendors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-bk-dark mb-4 text-[14px]">Product</h4>
            <ul className="space-y-3 text-[14px] text-bk-muted">
              <li><Link to="/discover" className="hover:text-bk-dark transition">Discover Kiosks</Link></li>
              <li><Link to="/register" className="hover:text-bk-dark transition">Become a Vendor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bk-dark mb-4 text-[14px]">Company</h4>
            <ul className="space-y-3 text-[14px] text-bk-muted">
              <li><Link to="/terms" className="hover:text-bk-dark transition">Terms & Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bk-dark mb-4 text-[14px]">Connect</h4>
            <ul className="space-y-3 text-[14px] text-bk-muted">
              <li><a href="mailto:hello@bluekiosk.com" className="hover:text-bk-dark transition">hello@bluekiosk.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bk-beige pt-8 text-[13px] text-bk-muted text-center">
          © {new Date().getFullYear()} BlueKiosk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
