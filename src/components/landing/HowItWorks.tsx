export default function HowItWorks() {
  const steps = [
    { step: "01", title: "Discover", desc: "Browse kiosks near you by category or location. Every vendor is verified and rated by real buyers." },
    { step: "02", title: "Connect", desc: "Chat with vendors in real-time, ask questions, negotiate prices, and agree on terms — all in-app." },
    { step: "03", title: "Transact Safely", desc: "Pay through BluPay escrow. Funds are held securely and only released when you confirm delivery." },
  ];

  return (
    <section className="bg-bk-beige py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight text-center mb-14 leading-[1.1]">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.step} className="bg-bk-cream rounded-2xl p-8">
              <span className="text-[48px] font-bold text-bk-beige-dark">{s.step}</span>
              <h3 className="text-[22px] font-bold text-bk-dark mt-2 mb-3">{s.title}</h3>
              <p className="text-[16px] text-bk-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
