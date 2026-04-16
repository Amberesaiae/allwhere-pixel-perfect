import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export default function BottomCTA() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="bg-bk-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex justify-center">
            <div className="w-[400px] h-[400px] rounded-full border-2 border-bk-dark overflow-hidden flex items-center justify-center">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67d2e42549802cd631d36db9_card-img__global.webp"
                alt="BlueKiosk across Ghana"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex-1 max-w-[520px]">
            <h2 className="text-[36px] md:text-[44px] font-bold text-bk-dark tracking-tight leading-[1.1] mb-6">
              {isAuthenticated
                ? "Discover more vendors across Ghana"
                : "Ready to buy and sell with confidence?"}
            </h2>
            <p className="text-[18px] text-bk-muted leading-relaxed mb-8">
              {isAuthenticated
                ? "Explore kiosks by category and region. Find the perfect vendor for your needs."
                : "Join thousands of Ghanaians already using BlueKiosk to find verified vendors and transact securely."}
            </p>
            {!isLoading && (
              isAuthenticated ? (
                <Link
                  to="/discover"
                  className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
                >
                  EXPLORE KIOSKS
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
                >
                  GET STARTED
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
