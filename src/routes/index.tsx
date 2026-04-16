import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCollage from "@/components/landing/HeroCollage";
import DealsOfTheDay from "@/components/landing/DealsOfTheDay";
import PromoBanner from "@/components/landing/PromoBanner";
import FeaturedListings from "@/components/landing/FeaturedListings";
import CategoryTiles from "@/components/landing/CategoryTiles";
import VendorSpotlight from "@/components/landing/VendorSpotlight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlueKiosk — Ghana's Trusted Marketplace" },
      {
        name: "description",
        content: "BlueKiosk connects buyers with verified local vendors in Ghana. Discover kiosks, browse listings, and contact sellers directly via WhatsApp.",
      },
      { property: "og:title", content: "BlueKiosk — Ghana's Trusted Marketplace" },
      { property: "og:description", content: "Discover verified vendors and shop directly via WhatsApp across Ghana." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroCollage />
      <DealsOfTheDay />
      <PromoBanner />
      <FeaturedListings />
      <CategoryTiles />
      <VendorSpotlight />
      <Footer />
    </main>
  );
}
