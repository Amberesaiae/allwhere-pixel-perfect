import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Kiosks | BlueKiosk" },
      { name: "description", content: "Browse verified vendors and kiosks near you in Ghana." },
      { property: "og:title", content: "Discover Kiosks | BlueKiosk" },
      { property: "og:description", content: "Browse verified vendors and kiosks near you in Ghana." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 24 })
      .then((data) => setProducts(data?.data?.products?.edges || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-bk-cream py-12 min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="text-[36px] font-bold text-bk-dark mb-2">Discover Kiosks</h1>
          <p className="text-[16px] text-bk-muted mb-8">Browse verified vendors near you</p>

          {loading ? (
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
      </main>
      <Footer />
    </>
  );
}
