import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | allwhere" },
      { name: "description", content: "No subscription fees. No hidden costs. Only pay for what you need." },
      { property: "og:title", content: "Pricing | allwhere" },
      { property: "og:description", content: "No subscription fees. No hidden costs. Only pay for what you need." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Small teams:",
    desc: "Get access to enterprise-level logistics without overhead",
  },
  {
    name: "Growing companies:",
    desc: "Reclaim time for work that matters while we handle logistics",
  },
  {
    name: "Global organizations:",
    desc: "Expand into new markets with no extra costs",
  },
];

const sessionPoints = [
  "Pinpoint the inefficiencies in your current device lifecycle",
  "Discuss how automation and global support can save you time and overhead",
  "Share a tailored ROI snapshot based on your use case and existing fleet data",
  "Map out easy next steps, whether that's a demo, a trial account, or placing your first order",
];

function PricingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left text */}
            <div className="flex-1 max-w-[560px]">
              <h1 className="text-[36px] md:text-[46px] font-bold text-aw-dark tracking-tight leading-[1.1] mb-6">
                No Subscription Fees. No Hidden Costs. Only Pay for What You Need.
              </h1>
              <p className="text-[17px] text-aw-muted leading-relaxed mb-6">
                allwhere's pricing is right-sized to your fleet so you can match costs to usage, avoid waste, and save money from day one.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-[15px] text-aw-dark">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Transparent and upfront.</strong> Clear costs you can trust, with no surprise fees.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-aw-dark">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No overhead.</strong> Zero setup costs or long-term lock-ins.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-aw-dark">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Scales with your fleet.</strong> Flexible pricing that grows (or shrinks) with your needs.</span>
                </li>
              </ul>
              <div className="bg-aw-beige rounded-[20px] p-6">
                <p className="text-[15px] text-aw-dark italic leading-relaxed mb-3">
                  "By taking over procurement, storage, and retrieval, allwhere cut our IT workload and gave us complete visibility — real savings in both time and cost."
                </p>
                <p className="text-[14px] font-bold text-aw-dark">Ian S., Sr. Systems Administrator</p>
              </div>
            </div>

            {/* Right form */}
            <div className="flex-1 max-w-[480px]">
              <div className="bg-aw-beige rounded-[24px] p-8">
                <h2 className="text-[24px] font-bold text-aw-dark mb-2">Get a Free Assessment</h2>
                <p className="text-[15px] text-aw-muted mb-6">
                  Learn how allwhere can save your team time, reduce overhead, and free you to focus on strategic work.
                </p>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-aw-dark mb-1 block">First Name*</label>
                      <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-aw-dark mb-1 block">Last Name*</label>
                      <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-aw-dark mb-1 block">Company Name*</label>
                    <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-aw-dark mb-1 block">Number of Employees*</label>
                    <input type="text" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-aw-dark mb-1 block">Work Email*</label>
                    <input type="email" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
                  </div>
                  <button type="submit" className="w-full text-[14px] font-semibold text-aw-dark bg-aw-yellow px-6 py-3 rounded-full hover:bg-aw-yellow-hover transition">
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Consultation */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65fd8b9683df2d4025cda9ad_Benefit%20Img__Global%20Markets.webp"
                alt="Globe illustration"
                className="w-full max-w-[400px] h-auto"
                loading="lazy"
              />
            </div>
            <div className="flex-1 max-w-[520px]">
              <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-5">
                Book Your Consultation
              </h2>
              <p className="text-[17px] text-aw-muted leading-relaxed mb-6">
                Reach out and we'll help you design the most efficient, cost-effective way to manage your devices so you can start saving time and money right away.
              </p>
              <h3 className="text-[18px] font-bold text-aw-dark mb-4">In your session, we will:</h3>
              <ul className="space-y-3">
                {sessionPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-aw-dark">
                    <span className="w-1.5 h-1.5 rounded-full bg-aw-dark mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight text-center mb-4">
            Simple, Transparent, Pay-As-You-Go
          </h2>
          <p className="text-[17px] text-aw-muted text-center max-w-[700px] mx-auto mb-12">
            Clear, fixed rates on best-in-class services. No subscription fees. Get access to expert retrievals, deployments, and storage with predictable prices you'll always get upfront.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-aw-beige rounded-[20px] p-8 text-center">
                <h3 className="text-[18px] font-bold text-aw-dark mb-3">{tier.name}</h3>
                <p className="text-[15px] text-aw-muted leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-[28px] font-bold text-aw-dark mb-4">Let's Get Started</h3>
            <p className="text-[17px] text-aw-muted mb-8">Get a tailored roadmap for reducing your IT workload and costs.</p>
            <Link
              to="/contact"
              className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-3.5 rounded-full hover:bg-aw-yellow-hover transition"
            >
              GET YOUR CUSTOM QUOTE
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
