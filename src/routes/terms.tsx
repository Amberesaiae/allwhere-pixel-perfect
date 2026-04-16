import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <Navbar />
      <main className="bg-bk-cream py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-[42px] md:text-[52px] font-bold text-bk-dark tracking-tight mb-12">
            Terms & Privacy
          </h1>

          <section className="mb-16">
            <h2 className="text-[28px] font-bold text-bk-dark mb-8">Terms of Service</h2>
            <div className="prose prose-sm max-w-none text-[15px] text-bk-dark leading-relaxed space-y-4">
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
            <h2 className="text-[28px] font-bold text-bk-dark mb-8">Privacy Policy</h2>
            <div className="prose prose-sm max-w-none text-[15px] text-bk-dark leading-relaxed space-y-4">
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
      <Footer />
    </>
  );
}
