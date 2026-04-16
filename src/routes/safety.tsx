import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, AlertTriangle, MessageCircle, Eye, MapPin, CreditCard } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety tips · bluekiosk" },
      { name: "description", content: "How to stay safe when buying and selling on bluekiosk." },
      { property: "og:title", content: "Safety tips · bluekiosk" },
      { property: "og:description", content: "How to stay safe when buying and selling on bluekiosk." },
    ],
  }),
  component: SafetyPage,
});

const TIPS = [
  { icon: Eye, title: "Inspect before you pay", body: "Always inspect the item in person before handing over money. For electronics, test that it powers on and works as described." },
  { icon: MapPin, title: "Meet in safe public places", body: "Pick a busy public location during daytime — a mall, shop, or transport hub. Avoid isolated areas." },
  { icon: MessageCircle, title: "Keep conversations on bluekiosk / WhatsApp", body: "Use WhatsApp or in-app messages so there's a record. Avoid sellers who push you to switch to other apps quickly." },
  { icon: CreditCard, title: "Beware of advance payments", body: "Never send mobile money, bank transfers, or vouchers to someone you have not met. If in doubt, pay on delivery." },
  { icon: ShieldCheck, title: "Prefer Verified kiosks", body: "Look for the Verified badge — these vendors have provided ID and confirmed contact details." },
  { icon: AlertTriangle, title: "Report anything suspicious", body: "If a listing or kiosk feels off, use the Report button on the listing page or email abuse@bluekiosk.com." },
];

function SafetyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page py-12">
        <div className="mx-auto max-w-[860px] px-4 md:px-6">
          <h1 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight">Safety tips</h1>
          <p className="text-[15px] text-bk-muted mt-2 mb-10 max-w-xl">
            bluekiosk is a marketplace — we connect buyers with vendors but transactions happen between you. Follow these tips to stay safe.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {TIPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl border border-bk-beige p-5">
                <div className="w-10 h-10 rounded-xl bg-bk-yellow flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-bk-dark" />
                </div>
                <h2 className="text-[15px] font-bold text-bk-dark mb-1">{title}</h2>
                <p className="text-[13px] text-bk-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-white rounded-2xl border border-bk-beige p-6 text-center">
            <p className="text-[14px] text-bk-dark mb-3 font-semibold">Need to report a problem?</p>
            <a href="mailto:abuse@bluekiosk.com" className="inline-block text-[14px] font-bold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
              Email abuse@bluekiosk.com
            </a>
            <p className="text-[12px] text-bk-muted mt-3">
              Or visit the <Link to="/help" className="underline hover:text-bk-dark">help center</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
