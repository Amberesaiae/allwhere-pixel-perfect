import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "allwhere — Automate the Employee Device Lifecycle" },
      {
        name: "description",
        content: "Procure, deploy, track, store, and recover IT equipment anywhere in the world.",
      },
      { property: "og:title", content: "allwhere — Automate the Employee Device Lifecycle" },
      {
        property: "og:description",
        content: "Procure, deploy, track, store, and recover IT equipment anywhere in the world.",
      },
    ],
  }),
  component: Index,
});

const trustedLogos = [
  { name: "Atomic", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d07c4491c9f69516f3f958_660485a25e5f248fd94ae8c6_atomic-financial-logo-p-2000.png", width: 100 },
  { name: "DroneDeploy", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e53797a856f_DroneDeploy%20Logo.svg", width: 140 },
  { name: "dbt Labs", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e7a8e7a8571_dbt-labs-logo.svg", width: 100 },
  { name: "Patreon", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9ec0a07a856e_Patreon%20Logo.svg", width: 120 },
  { name: "Found", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/660486dff4410a26e9e7ea3b_Found.png", width: 90 },
  { name: "Namely", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/6604874de8fd25a8be13e75e_Namely.png", width: 110 },
  { name: "Spark", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9ecda07a8560_Spark.svg", width: 100 },
  { name: "Verifiable", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/660487c04e6b55e0fcc44477_Verifiable.png", width: 110 },
  { name: "GlossGenius", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/66048719e8fd25a8be141d35_GlossGenius.png", width: 130 },
  { name: "Skillshare", src: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/66048773e8fd25a8be14445c_Skillshare.png", width: 110 },
];

const testimonials = [
  {
    logo: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d07c4401c4e0ebcf1971e9_6604864ba9e835b44f2a11b8_growtherapy.png",
    logoWidth: 150,
    quote: "allwhere has significantly reduced our IT workload by taking over procurement, storage, and retrieval — all with complete visibility in one dashboard.",
    name: "Ian S.",
    role: "Sr. Systems Administrator",
  },
  {
    logo: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9ecda07a8560_Spark.svg",
    logoWidth: 100,
    quote: "Onboarding a new hire went from an hour of my time to under two minutes.",
    name: "Byron E.",
    role: "Co-Founder, Spark",
  },
  {
    logo: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d07cf17a6cbec1fe0b57d7_Linktree-logo.png",
    logoWidth: 100,
    quote: "Retrieving a laptop from the Philippines used to take three months. Now it's a few clicks. allwhere handles shipping, customs, everything — so I don't lose weeks chasing down equipment.",
    name: "Aaron",
    role: "IT Operations Engineer, Linktree",
  },
  {
    logo: "https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d07c4491c9f69516f3f958_660485a25e5f248fd94ae8c6_atomic-financial-logo-p-2000.png",
    logoWidth: 100,
    quote: "We never worry about missing equipment anymore — allwhere makes it simple to track every device and ensure it's returned, no matter where the employee is.",
    name: "Bailee J.",
    role: "Administrator",
  },
];

function Index() {
  return (
    <main>
      {/* Hero Section - Two column with buildings illustration */}
      <section className="bg-aw-cream pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 max-w-[560px]">
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-bold leading-[1.05] tracking-tight text-aw-dark mb-6">
              Automate the employee device lifecycle.
            </h1>
            <p className="text-[18px] md:text-[20px] leading-[1.6] text-aw-muted mb-8 max-w-[480px]">
              Procure, deploy, track, store, and recover IT equipment anywhere in the world
            </p>
            <Link
              to="/contact"
              className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-4 rounded-full hover:bg-aw-yellow-hover transition"
            >
              GET STARTED
            </Link>
          </div>
          <div className="flex-1 max-w-[620px]">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67d2e42549802cd631d36db9_card-img__global.webp"
              alt="Illustration of cities around the world with delivery boxes"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Trusted By Strip */}
      <section className="bg-aw-cream py-10 border-t border-aw-beige">
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="text-[15px] text-aw-dark mb-8 font-medium">allwhere is trusted by</p>
          <div className="flex items-center gap-8 md:gap-12 flex-wrap">
            {trustedLogos.map((logo) => (
              <img key={logo.name} src={logo.src} alt={logo.name} style={{ width: logo.width }} className="h-auto opacity-70 hover:opacity-100 transition" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* Main Heading */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-tight text-aw-dark mb-6">
            Fully Automate Device Lifecycles. Zero Touch. Headache-Free.
          </h2>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-aw-muted max-w-[720px] mx-auto">
            allwhere automates the entire employee device lifecycle from effortless deployment to secure, compliant retrieval with global reach and real-time control.
          </p>
        </div>
      </section>

      {/* 3 Side-by-Side Sections */}
      <section className="bg-aw-cream pb-16">
        <div className="mx-auto max-w-[1280px] px-6 space-y-28">
          {/* Procurement & Onboarding */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-[520px]">
              <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-5 leading-[1.15]">
                Procurement &amp; Onboarding
              </h3>
              <p className="text-[18px] text-aw-muted leading-relaxed mb-8">
                Get work-ready laptops and accessories from trusted vendors shipped to teams in 48 countries—fast, reliable, and ready from day one.
              </p>
              <a href="#" className="inline-block text-[15px] font-semibold text-aw-dark px-6 py-3 rounded-full border-2 border-aw-dark hover:bg-aw-beige transition">
                Learn More
              </a>
            </div>
            <div className="flex-1 relative max-w-[560px]">
              <div className="rounded-2xl overflow-hidden bg-[#c5d87d]">
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/63a278469eb881535a837dc3_remote-onboarding-lifecycle-management.webp"
                  alt="Illustration of woman holding a laptop while standing next to her home office"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/658047e55ad8a744f00a295d_ui__procurement_order-table.png"
                alt="Order table UI"
                className="absolute -bottom-6 -right-6 w-[160px] shadow-xl rounded-xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Retrievals & Storage */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-[520px]">
              <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-5 leading-[1.15]">
                Retrievals &amp; Storage
              </h3>
              <p className="text-[18px] text-aw-muted leading-relaxed mb-8">
                Offboard employees and easily recover devices anywhere with tracked return kits, secure device wipes, and full chain-of-custody compliance.
              </p>
              <a href="#" className="inline-block text-[15px] font-semibold text-aw-dark px-6 py-3 rounded-full border-2 border-aw-dark hover:bg-aw-beige transition">
                Learn More
              </a>
            </div>
            <div className="flex-1 relative max-w-[560px]">
              <div className="rounded-2xl overflow-hidden bg-[#b8d4e3]">
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65804977c46facb7f9d38daa_ui__retrievals.webp"
                  alt="Illustration of a laptop going into an allwhere box"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/658049841b476526140f4119_ui__retrievals_devices.png"
                alt="80 devices in inventory"
                className="absolute -bottom-6 -left-6 w-[160px] shadow-xl rounded-xl"
                loading="lazy"
              />
              <div className="absolute top-6 -right-4 bg-white rounded-xl shadow-xl p-4 text-center">
                <p className="text-[11px] text-aw-muted mb-1">This month you saved:</p>
                <p className="text-[32px] font-bold text-aw-dark leading-none">34.5h</p>
                <img src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65804c1e37ab351a8682aa28_ui__retrievals_monthly_graph.png" alt="Bar graph" className="w-[90px] mt-2" />
              </div>
            </div>
          </div>

          {/* Fleet Visibility */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-[520px]">
              <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-5 leading-[1.15]">
                <strong>Fleet Visibility &amp; Lifecycle Management</strong>
              </h3>
              <p className="text-[18px] text-aw-muted leading-relaxed mb-8">
                See every device in one dashboard: track condition, usage, and value so you can plan refreshes, cut costs, and stay audit-ready.
              </p>
              <a href="#" className="inline-block text-[15px] font-semibold text-aw-dark px-6 py-3 rounded-full border-2 border-aw-dark hover:bg-aw-beige transition">
                Learn More
              </a>
            </div>
            <div className="flex-1 max-w-[560px]">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e108d7a85b2_dashboard.webp"
                  alt="allwhere dashboard showing device list"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="text-center mb-14">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e88a47a854d_Testimonial%20Stars.webp"
              alt="5 stars"
              className="h-6 mx-auto mb-8"
              loading="lazy"
            />
            <h2 className="text-[36px] md:text-[48px] font-bold text-aw-dark tracking-tight mb-4 leading-[1.1]">
              Helping IT teams do more with less busywork
            </h2>
            <p className="text-[18px] text-aw-muted max-w-[680px] mx-auto leading-relaxed">
              From startups to global enterprises, allwhere cuts IT workload, speeds deployments, and ensures secure, compliant fleet management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-aw-beige rounded-[20px] p-8 md:p-10">
                <img src={t.logo} alt={t.name} style={{ width: t.logoWidth }} className="h-auto mb-6" loading="lazy" />
                <p className="text-[16px] text-aw-dark leading-relaxed italic mb-6">"{t.quote}"</p>
                <p className="text-[16px] font-bold text-aw-dark">{t.name}</p>
                <p className="text-[14px] text-aw-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[960px] px-6">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight text-center mb-10">
            See allwhere in action
          </h2>
          <div className="relative w-full rounded-xl overflow-hidden border-2 border-aw-dark" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/IW_m4cCJexk?rel=0&modestbranding=1"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="allwhere | The Employee Provisioning Platform"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 flex justify-center">
              <div className="w-[400px] h-[400px] rounded-full border-2 border-aw-dark overflow-hidden flex items-center justify-center">
                <img
                  src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67d2e42549802cd631d36db9_card-img__global.webp"
                  alt="Global deployment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex-1 max-w-[520px]">
              <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight leading-[1.1] mb-6">
                <strong>Save time. Cut Costs. Stay in control.</strong>
              </h2>
              <p className="text-[18px] text-aw-muted leading-relaxed mb-8">
                Ready to automate your employee device lifecycle?
              </p>
              <Link
                to="/contact"
                className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-4 rounded-full hover:bg-aw-yellow-hover transition"
              >
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
