import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCollage from "@/components/landing/HeroCollage";
import DealsOfTheDay from "@/components/landing/DealsOfTheDay";
import PromoBanner from "@/components/landing/PromoBanner";
import FeaturedListings from "@/components/landing/FeaturedListings";
import CategoryTiles from "@/components/landing/CategoryTiles";
import VendorSpotlight from "@/components/landing/VendorSpotlight";
import VerifiedKiosksNearYou from "@/components/landing/VerifiedKiosksNearYou";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bluekiosk — Ghana's trusted marketplace" },
      {
        name: "description",
        content: "bluekiosk connects buyers with verified local vendors in Ghana. Discover kiosks, browse listings, and contact sellers directly via WhatsApp.",
      },
      { property: "og:title", content: "bluekiosk — Ghana's trusted marketplace" },
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
      <VerifiedKiosksNearYou />
      <Footer />
    </main>
  );
}
