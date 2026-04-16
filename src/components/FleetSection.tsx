import { Monitor, Shield, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: Monitor,
    title: "Full fleet visibility",
    description:
      "See every device — who has it, where it is, and its current status — in one unified view.",
  },
  {
    icon: Shield,
    title: "Security & compliance",
    description:
      "Ensure every device meets your security policies with automated compliance monitoring.",
  },
  {
    icon: TrendingUp,
    title: "Cost optimization",
    description:
      "Reduce equipment spend by redeploying existing devices and extending asset lifecycles.",
  },
];

export default function FleetSection() {
  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight mb-4">
            Your fleet at a glance
          </h2>
          <p className="text-[17px] text-aw-muted max-w-[560px] mx-auto">
            Everything you need to manage your organization's equipment — visibility, security, and savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-aw-beige rounded-[20px] p-8 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-aw-cream flex items-center justify-center mb-6">
                <card.icon className="w-6 h-6 text-aw-dark" strokeWidth={1.5} />
              </div>
              <h3 className="text-[20px] font-bold text-aw-dark mb-3">{card.title}</h3>
              <p className="text-[15px] text-aw-muted leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
