import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DeploySection from "@/components/DeploySection";
import LifecycleSection from "@/components/LifecycleSection";
import RedeploySection from "@/components/RedeploySection";
import ConnectSection from "@/components/ConnectSection";
import FleetSection from "@/components/FleetSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "How Remote-First Setups Work | allwhere" },
      {
        name: "description",
        content:
          "Put the employee device lifecycle on autopilot. From deploy to retrieval, allwhere manages every stage of your employee equipment lifecycle.",
      },
      { property: "og:title", content: "How Remote-First Setups Work | allwhere" },
      {
        property: "og:description",
        content:
          "Put the employee device lifecycle on autopilot. From deploy to retrieval, allwhere manages every stage.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-aw-cream">
      <Navbar />
      <HeroSection />
      <DeploySection />
      <LifecycleSection />
      <RedeploySection />
      <ConnectSection />
      <FleetSection />
      <CTASection />
      <Footer />
    </div>
  );
}
