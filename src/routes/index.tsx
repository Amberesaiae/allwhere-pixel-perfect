import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsStrip from "@/components/landing/StatsStrip";
import ValueProp from "@/components/landing/ValueProp";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CategoryShowcase from "@/components/landing/CategoryShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import VendorSpotlight from "@/components/landing/VendorSpotlight";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import BottomCTA from "@/components/landing/BottomCTA";

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
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <ValueProp />
      <BenefitsSection />
      <CategoryShowcase />
      <HowItWorks />
      <VendorSpotlight />
      <FeaturedProducts />
      <Testimonials />
      <FAQSection />
      <BottomCTA />
      <Footer />
    </main>
  );
}
