import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function HeroSection() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const ready = !isLoading && !rolesLoading;

  return (
    <section className="bg-bk-cream pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
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
              BROWSE KIOSKS
            </Link>
            {ready && isAuthenticated ? (
              isVendor ? (
                <Link
                  to="/dashboard"
                  className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
                >
                  GO TO DASHBOARD
                </Link>
              ) : (
                <Link
                  to="/become-vendor"
                  className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
                >
                  START SELLING
                </Link>
              )
            ) : (
              <Link
                to="/register"
                className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
              >
                SIGN UP FREE
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1 max-w-[620px]">
          <img
            src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67d2e42549802cd631d36db9_card-img__global.webp"
            alt="BlueKiosk marketplace connecting vendors and buyers across Ghana"
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
