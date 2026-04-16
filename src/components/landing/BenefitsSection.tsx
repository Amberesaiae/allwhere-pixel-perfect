import { Shield, Search, Wallet } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Trust & Verification",
    description: "Every vendor is verified. Buyer protection through escrow ensures you only pay when you're satisfied.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Find exactly what you need with location-based search, category filters, and curated vendor feeds.",
    color: "bg-bk-success/10 text-bk-success",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description: "BluPay escrow holds funds safely until delivery is confirmed. Pay with Mobile Money or card via Paystack.",
    color: "bg-bk-warning/10 text-bk-warning",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Why BlueKiosk?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Built for the way Ghanaians buy and sell — with trust at the center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${b.color} flex items-center justify-center mb-6`}>
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
