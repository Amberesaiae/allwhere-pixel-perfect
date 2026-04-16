import { Link } from "@tanstack/react-router";

export default function LandingFooter() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BK</span>
              </div>
              <span className="text-xl font-bold">BlueKiosk</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Ghana's trusted marketplace connecting buyers with verified local vendors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Product</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/discover" className="hover:opacity-100 transition">Discover Kiosks</Link></li>
              <li><Link to="/register" className="hover:opacity-100 transition">Become a Vendor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Company</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/terms" className="hover:opacity-100 transition">Terms & Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50">Connect</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><a href="mailto:hello@bluekiosk.com" className="hover:opacity-100 transition">hello@bluekiosk.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-sm opacity-50 text-center">
          © {new Date().getFullYear()} BlueKiosk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
