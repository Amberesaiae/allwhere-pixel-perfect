import { Link } from "@tanstack/react-router";

export default function BenefitsSection() {
  return (
    <section className="bg-bk-cream pb-16">
      <div className="mx-auto max-w-[1280px] px-6 space-y-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-[520px]">
            <h3 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight mb-5 leading-[1.15]">
              Trust &amp; Verification
            </h3>
            <p className="text-[18px] text-bk-muted leading-relaxed mb-8">
              Every vendor is verified before listing. Buyer protection through escrow ensures you only pay when you're satisfied with your purchase.
            </p>
            <Link to="/discover" className="inline-block text-[15px] font-semibold text-bk-dark px-6 py-3 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition">
              Discover Vendors
            </Link>
          </div>
          <div className="flex-1 relative max-w-[560px]">
            <div className="rounded-2xl overflow-hidden bg-[#c5d87d]">
              <img src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/63a278469eb881535a837dc3_remote-onboarding-lifecycle-management.webp" alt="Verified vendor onboarding" className="w-full h-auto" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-[520px]">
            <h3 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight mb-5 leading-[1.15]">
              Secure Escrow Payments
            </h3>
            <p className="text-[18px] text-bk-muted leading-relaxed mb-8">
              BluPay escrow holds funds safely until delivery is confirmed. Pay with Mobile Money or card via Paystack — your money is always protected.
            </p>
            <Link to="/register" className="inline-block text-[15px] font-semibold text-bk-dark px-6 py-3 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition">
              Get Started
            </Link>
          </div>
          <div className="flex-1 relative max-w-[560px]">
            <div className="rounded-2xl overflow-hidden bg-[#b8d4e3]">
              <img src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65804977c46facb7f9d38daa_ui__retrievals.webp" alt="Secure payment illustration" className="w-full h-auto" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-[520px]">
            <h3 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight mb-5 leading-[1.15]">
              Easy Discovery &amp; Real-Time Chat
            </h3>
            <p className="text-[18px] text-bk-muted leading-relaxed mb-8">
              Find what you need with location-based search and category filters. Chat with vendors in real-time, negotiate prices, and agree on terms — all in-app.
            </p>
            <Link to="/discover" className="inline-block text-[15px] font-semibold text-bk-dark px-6 py-3 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition">
              Browse Kiosks
            </Link>
          </div>
          <div className="flex-1 max-w-[560px]">
            <div className="rounded-2xl overflow-hidden">
              <img src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e108d7a85b2_dashboard.webp" alt="BlueKiosk discovery dashboard" className="w-full h-auto" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
