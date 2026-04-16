import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get Started | allwhere" },
      { name: "description", content: "Schedule time with an allwhere expert to assess your needs and walk you through a platform demo." },
      { property: "og:title", content: "Get Started | allwhere" },
      { property: "og:description", content: "Schedule time with an allwhere expert." },
    ],
  }),
  component: ContactPage,
});

const trustedLogos = [
  { name: "GrowTherapy", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d07c4401c4e0ebcf1971e9_6604864ba9e835b44f2a11b8_growtherapy.png", width: 130 },
  { name: "DroneDeploy", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e53797a856f_DroneDeploy%20Logo.svg", width: 120 },
  { name: "dbt Labs", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e7a8e7a8571_dbt-labs-logo.svg", width: 90 },
  { name: "Patreon", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9ec0a07a856e_Patreon%20Logo.svg", width: 100 },
];

function ContactPage() {
  return (
    <main>
      {/* Hero with form */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
            {/* Left illustration */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/63a278469eb881535a837dc3_remote-onboarding-lifecycle-management.webp"
                alt="Person working at desk"
                className="w-full max-w-[480px] h-auto rounded-2xl"
                loading="eager"
              />
            </div>

            {/* Right form */}
            <div className="flex-1 max-w-[480px]">
              <h1 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-4">Get Started</h1>
              <p className="text-[17px] text-aw-muted leading-relaxed mb-8">
                Schedule time with an allwhere expert to assess your needs and walk you through a platform demo.
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
      </section>

      {/* Trusted By */}
      <section className="bg-aw-cream py-12">
        <div className="mx-auto max-w-[1080px] px-6">
          <p className="text-[13px] text-aw-muted text-center mb-6 uppercase tracking-wider font-medium">allwhere is trusted by</p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-60">
            {trustedLogos.map((logo) => (
              <img key={logo.name} src={logo.src} alt={logo.name} style={{ width: logo.width }} className="h-auto grayscale" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works summary */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight mb-4">How It Works</h2>
          <p className="text-[17px] text-aw-muted max-w-[640px] mx-auto">
            Save time and money by simplifying your equipment processes with our powerful software and trusted physical operations.
          </p>
        </div>
      </section>
    </main>
  );
}
