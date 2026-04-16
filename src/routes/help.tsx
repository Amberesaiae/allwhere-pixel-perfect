import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help center · bluekiosk" },
      { name: "description", content: "Answers to common questions about buying and selling on bluekiosk." },
      { property: "og:title", content: "Help center · bluekiosk" },
      { property: "og:description", content: "Answers to common questions about buying and selling on bluekiosk." },
    ],
  }),
  component: HelpPage,
});

const FAQS = [
  { q: "How do I contact a seller?", a: "Tap “Contact via WhatsApp” on any listing or kiosk page. If a vendor hasn't added WhatsApp, you can call the listed phone number." },
  { q: "What does the Verified badge mean?", a: "Verified kiosks have submitted ID and confirmed their contact details with the bluekiosk team. It's a stronger trust signal but does not guarantee any specific transaction." },
  { q: "How do I save a listing for later?", a: "Tap the heart icon on any listing card or detail page. You can find saved listings under your profile menu." },
  { q: "How do I become a vendor?", a: "Open “Sell” from the navigation, activate your vendor account, then create your kiosk and post listings." },
  { q: "Does bluekiosk handle payments?", a: "Not yet. For now buyers and vendors arrange payment directly (cash on delivery or mobile money). Escrow is on our roadmap." },
  { q: "How do I report a suspicious listing?", a: "Use the Report button on the listing page or email abuse@bluekiosk.com." },
];

function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page py-12">
        <div className="mx-auto max-w-[760px] px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-bk-yellow flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-bk-dark" />
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-bk-dark tracking-tight">Help center</h1>
          </div>
          <p className="text-[15px] text-bk-muted mt-1 mb-10">Answers to common questions. Still stuck? Email us.</p>

          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-white rounded-2xl border border-bk-beige p-5 open:shadow-sm">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15px] font-semibold text-bk-dark">
                  {f.q}
                  <span className="text-bk-muted group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-[14px] text-bk-muted leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-bk-beige p-6 text-center">
            <Mail className="w-6 h-6 text-bk-dark mx-auto mb-2" />
            <p className="text-[14px] text-bk-dark mb-3 font-semibold">Still need help?</p>
            <a href="mailto:hello@bluekiosk.com" className="inline-block text-[14px] font-bold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
              Email hello@bluekiosk.com
            </a>
            <p className="text-[12px] text-bk-muted mt-3">
              See also <Link to="/safety" className="underline hover:text-bk-dark">safety tips</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
