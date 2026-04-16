import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Product | BlueKiosk" },
      { name: "description", content: "View product details on BlueKiosk." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => setProduct(data?.data?.product || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh] bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-bk-cream">
          <h1 className="text-[28px] font-bold text-bk-dark mb-4">Product not found</h1>
          <Link to="/discover" className="text-[15px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
            Back to Discover
          </Link>
        </div>
      </>
    );
  }

  const images = product.images?.edges || [];
  const variants = product.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIdx]?.node;
  const selectedImage = images[selectedImageIdx]?.node;

  return (
    <>
      <Navbar />
      <main className="bg-bk-cream py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <Link to="/discover" className="text-[14px] text-bk-muted hover:text-bk-dark transition mb-8 inline-block">
            ← Back to Discover
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Images */}
            <div className="flex-1 max-w-[600px]">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-bk-beige mb-4">
                {selectedImage ? (
                  <img src={selectedImage.url} alt={selectedImage.altText || product.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bk-muted">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${i === selectedImageIdx ? "border-bk-dark" : "border-bk-beige"}`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight mb-4">{product.title}</h1>
              <p className="text-[24px] font-bold text-bk-dark mb-6">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </p>
              <p className="text-[16px] text-bk-muted leading-relaxed mb-8">{product.description}</p>

              {/* Variants */}
              {product.options?.filter((o: any) => o.name !== "Title").map((option: any) => (
                <div key={option.name} className="mb-6">
                  <label className="text-[14px] font-semibold text-bk-dark mb-2 block">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: any, i: number) => {
                      const optVal = v.node.selectedOptions.find((o: any) => o.name === option.name)?.value;
                      return (
                        <button
                          key={v.node.id}
                          onClick={() => setSelectedVariantIdx(i)}
                          className={`px-4 py-2 rounded-full text-[14px] font-medium border transition ${
                            i === selectedVariantIdx ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-dark hover:border-bk-dark"
                          }`}
                        >
                          {optVal || v.node.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  if (!selectedVariant) return;
                  addItem({
                    product: { node: product },
                    variantId: selectedVariant.id,
                    variantTitle: selectedVariant.title,
                    price: selectedVariant.price,
                    quantity: 1,
                    selectedOptions: selectedVariant.selectedOptions || [],
                  });
                }}
                disabled={isLoading || !selectedVariant?.availableForSale}
                className="w-full text-[16px] font-semibold bg-bk-yellow text-bk-dark py-4 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
