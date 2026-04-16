import { createFileRoute, Link } from "@tanstack/react-router";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Privacy | BlueKiosk" },
      { name: "description", content: "BlueKiosk Terms of Service and Privacy Policy." },
      { property: "og:title", content: "Terms & Privacy | BlueKiosk" },
      { property: "og:description", content: "BlueKiosk Terms of Service and Privacy Policy." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <LandingHeader />
      <main className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-12">
            Terms & Privacy
          </h1>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Terms of Service</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                By using BlueKiosk, you agree to these terms. BlueKiosk provides a marketplace
                platform connecting buyers with verified vendors in Ghana. All transactions are
                facilitated through our BluPay escrow system for your protection.
              </p>
              <p>
                Vendors must maintain accurate listings and fulfill orders as described. Buyers
                must confirm receipt of goods before escrow funds are released.
              </p>
              <p>
                BlueKiosk reserves the right to suspend accounts that violate our community
                guidelines or engage in fraudulent activity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Privacy Policy</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                BlueKiosk collects personal information necessary to provide our marketplace
                services, including name, email, phone number, and location data.
              </p>
              <p>
                We use this information to verify vendor identities, facilitate transactions,
                and improve our platform. We do not sell your personal data to third parties.
              </p>
              <p>
                For questions about your data, contact us at hello@bluekiosk.com.
              </p>
            </div>
          </section>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
