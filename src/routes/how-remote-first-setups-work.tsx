import { createFileRoute, Link } from "@tanstack/react-router";
import HeroSection from "@/components/HeroSection";
import DeploySection from "@/components/DeploySection";
import LifecycleSection from "@/components/LifecycleSection";
import RedeploySection from "@/components/RedeploySection";
import ConnectSection from "@/components/ConnectSection";
import FleetSection from "@/components/FleetSection";
import CTASection from "@/components/CTASection";

export const Route = createFileRoute("/how-remote-first-setups-work")({
  head: () => ({
    meta: [
      { title: "How Remote-First Setups Work | allwhere" },
      {
        name: "description",
        content: "Put the employee device lifecycle on autopilot. From deploy to retrieval, allwhere manages every stage.",
      },
      { property: "og:title", content: "How Remote-First Setups Work | allwhere" },
      { property: "og:description", content: "Put the employee device lifecycle on autopilot." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <main>
      <HeroSection />
      <DeploySection />
      <LifecycleSection />
      <RedeploySection />
      <ConnectSection />
      <FleetSection />
      <CTASection />
    </main>
  );
}
