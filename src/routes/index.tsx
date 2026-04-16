import { createFileRoute } from "@tanstack/react-router";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlueKiosk — Find Trusted Vendors Near You in Ghana" },
      {
        name: "description",
        content: "BlueKiosk is Ghana's trust-broker marketplace. Discover verified vendors, chat in real-time, and pay securely with escrow protection.",
      },
      { property: "og:title", content: "BlueKiosk — Find Trusted Vendors Near You in Ghana" },
      {
        property: "og:description",
        content: "Discover verified vendors, chat in real-time, and pay securely with escrow protection.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main>
      <LandingHeader />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
