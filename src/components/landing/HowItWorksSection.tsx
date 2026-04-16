const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Browse kiosks near you by category or location. Every vendor is verified and rated by real buyers.",
  },
  {
    number: "02",
    title: "Connect",
    description: "Chat with vendors in real-time, ask questions, negotiate prices, and agree on terms — all in-app.",
  },
  {
    number: "03",
    title: "Transact Safely",
    description: "Pay through BluPay escrow. Funds are held securely and only released when you confirm delivery.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three simple steps from discovery to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <span className="text-6xl font-extrabold text-primary/10 absolute -top-4 -left-2">
                {step.number}
              </span>
              <div className="relative pt-10">
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
