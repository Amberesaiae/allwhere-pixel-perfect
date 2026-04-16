import { createFileRoute, Link } from "@tanstack/react-router";
import LandingHeader from "@/components/landing/LandingHeader";

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
  return (
    <>
      <LandingHeader />
      <main className="py-12 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Kiosks</h1>
          <p className="text-muted-foreground mb-8">Browse verified vendors near you</p>

          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🏪</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Coming soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The discovery feed with search, filters, and kiosk cards will be built after the database is set up with Lovable Cloud.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
