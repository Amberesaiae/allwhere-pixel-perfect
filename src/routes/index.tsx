import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlueKiosk — Ghana's Trusted Marketplace" },
      {
        name: "description",
        content: "BlueKiosk connects buyers with verified local vendors in Ghana. Discover kiosks, chat in real-time, and pay securely with escrow protection.",
      },
      { property: "og:title", content: "BlueKiosk — Ghana's Trusted Marketplace" },
      { property: "og:description", content: "Discover verified vendors, chat in real-time, and pay securely with escrow protection." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 12 })
      .then((data) => setProducts(data?.data?.products?.edges || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <main>
      <Navbar />

      {/* Hero */}
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
              <Link
                to="/register"
                className="inline-block text-[15px] font-semibold text-bk-dark px-8 py-4 rounded-full border-2 border-bk-dark hover:bg-bk-beige transition"
              >
                SIGN UP FREE
              </Link>
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

      {/* Stats strip */}
      <section className="bg-bk-cream py-10 border-t border-bk-beige">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p className="text-[36px] font-bold text-bk-dark">500+</p>
              <p className="text-[14px] text-bk-muted">Verified Vendors</p>
            </div>
            <div className="text-center">
              <p className="text-[36px] font-bold text-bk-dark">10k+</p>
              <p className="text-[14px] text-bk-muted">Happy Buyers</p>
            </div>
            <div className="text-center">
              <p className="text-[36px] font-bold text-bk-dark">16</p>
              <p className="text-[14px] text-bk-muted">Ghana Regions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main value prop */}
      <section className="bg-bk-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-tight text-bk-dark mb-6">
            Buy and Sell with Confidence. Every Transaction Protected.
          </h2>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-bk-muted max-w-[720px] mx-auto">
            BlueKiosk is Ghana's trust-broker marketplace — connecting buyers with verified vendors through secure escrow payments and real-time communication.
          </p>
        </div>
      </section>

      {/* 3 Benefits */}
      <section className="bg-bk-cream pb-16">
        <div className="mx-auto max-w-[1280px] px-6 space-y-28">
          {/* Trust & Verification */}
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
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/63a278469eb881535a837dc3_remote-onboarding-lifecycle-management.webp"
                  alt="Verified vendor onboarding"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Secure Payments */}
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
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65804977c46facb7f9d38daa_ui__retrievals.webp"
                  alt="Secure payment illustration"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Easy Discovery */}
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
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e108d7a85b2_dashboard.webp"
                  alt="BlueKiosk discovery dashboard"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-bk-beige py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight text-center mb-14 leading-[1.1]">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Discover", desc: "Browse kiosks near you by category or location. Every vendor is verified and rated by real buyers." },
              { step: "02", title: "Connect", desc: "Chat with vendors in real-time, ask questions, negotiate prices, and agree on terms — all in-app." },
              { step: "03", title: "Transact Safely", desc: "Pay through BluPay escrow. Funds are held securely and only released when you confirm delivery." },
            ].map((s) => (
              <div key={s.step} className="bg-bk-cream rounded-2xl p-8">
                <span className="text-[48px] font-bold text-bk-beige-dark">{s.step}</span>
                <h3 className="text-[22px] font-bold text-bk-dark mt-2 mb-3">{s.title}</h3>
                <p className="text-[16px] text-bk-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products from Shopify */}
      <section className="bg-bk-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight text-center mb-4">
            Featured Products
          </h2>
          <p className="text-[18px] text-bk-muted text-center mb-12 max-w-[600px] mx-auto">
            Browse products from verified vendors on BlueKiosk
          </p>

          {loadingProducts ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-bk-beige rounded-2xl p-12 text-center">
              <p className="text-[18px] text-bk-dark font-semibold mb-2">No products yet</p>
              <p className="text-[15px] text-bk-muted">Products will appear here once vendors add them to the marketplace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const p = product.node;
                const variant = p.variants.edges[0]?.node;
                const image = p.images.edges[0]?.node;
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-bk-beige hover:shadow-lg transition group">
                    <Link to="/product/$handle" params={{ handle: p.handle }} className="block">
                      <div className="aspect-square bg-bk-beige overflow-hidden">
                        {image ? (
                          <img src={image.url} alt={image.altText || p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-bk-muted">No image</div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to="/product/$handle" params={{ handle: p.handle }}>
                        <h3 className="text-[16px] font-semibold text-bk-dark mb-1 truncate">{p.title}</h3>
                      </Link>
                      <p className="text-[14px] text-bk-muted mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-bold text-bk-dark">
                          {p.priceRange.minVariantPrice.currencyCode} {parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}
                        </span>
                        {variant && (
                          <button
                            onClick={() =>
                              addItem({
                                product,
                                variantId: variant.id,
                                variantTitle: variant.title,
                                price: variant.price,
                                quantity: 1,
                                selectedOptions: variant.selectedOptions || [],
                              })
                            }
                            disabled={isLoading || !variant.availableForSale}
                            className="text-[13px] font-semibold bg-bk-yellow text-bk-dark px-4 py-2 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
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
                Ready to buy and sell with confidence?
              </h2>
              <p className="text-[18px] text-bk-muted leading-relaxed mb-8">
                Join thousands of Ghanaians already using BlueKiosk to find verified vendors and transact securely.
              </p>
              <Link
                to="/register"
                className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
              >
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
