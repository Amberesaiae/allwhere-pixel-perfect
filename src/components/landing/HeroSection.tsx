import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function HeroSection() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const ready = !isLoading && !rolesLoading;

  return (
    <section className="bg-bk-cream pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 max-w-[560px]">
          <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-tight text-bk-dark mb-6">
            Find Trusted Vendors Near You in Ghana
          </h1>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-bk-muted mb-8 max-w-[480px]">
            BlueKiosk connects buyers with verified local vendors through secure escrow payments, real-time chat, and a discovery feed built for trust.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/discover"
              className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
            >
              Browse Listings
            </Link>
            {ready && isAuthenticated ? (
              isVendor ? (
                <Link
                  to="/dashboard"
                  className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/become-vendor"
                  className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
                >
                  Start Selling
                </Link>
              )
            ) : (
              <Link
                to="/register"
                className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1 max-w-[620px]">
          {/* Abstract marketplace illustration */}
          <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-bk-yellow/30 via-bk-beige to-bk-cream-dark overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 p-8 w-full max-w-[400px]">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-white/70 backdrop-blur-sm border border-bk-beige/50 flex items-center justify-center"
                  >
                    <div className={`w-8 h-8 rounded-lg ${i % 3 === 0 ? 'bg-bk-yellow/60' : i % 3 === 1 ? 'bg-bk-dark/10' : 'bg-bk-teal/40'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-bk-beige/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bk-yellow/40 flex items-center justify-center text-[14px] font-bold text-bk-dark">BK</div>
                <div>
                  <p className="text-[13px] font-semibold text-bk-dark">Discover verified vendors</p>
                  <p className="text-[11px] text-bk-muted">Products, services & more across Ghana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
