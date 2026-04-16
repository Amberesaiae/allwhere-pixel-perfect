import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/global")({
  head: () => ({
    meta: [
      { title: "Global Coverage | allwhere" },
      { name: "description", content: "Deploy, refresh, and retrieve IT equipment for your employees worldwide." },
      { property: "og:title", content: "Global Coverage | allwhere" },
      { property: "og:description", content: "allwhere operates in 48+ countries worldwide." },
    ],
  }),
  component: GlobalPage,
});

const regions = {
  "North America": [
    "Canada", "Costa Rica", "Dominican Republic", "El Salvador", "Guatemala",
    "Honduras", "Jamaica", "Nicaragua", "Panama", "Puerto Rico", "United States",
  ],
  "Latin America": [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Mexico", "Paraguay", "Peru",
  ],
  "Europe": [
    "Austria", "Belgium", "Bulgaria", "Canary Islands", "Croatia", "Cyprus",
    "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany",
    "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Liechtenstein",
    "Lithuania", "Luxembourg", "Malta", "Netherlands", "Norway", "Poland",
    "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
  ],
  "United Kingdom & Ireland": ["Ireland", "United Kingdom"],
  "Australia/New Zealand": ["Australia", "New Zealand"],
  "Asia": ["India", "Philippines"],
};

const whyChoose = [
  {
    title: "Flexibility",
    points: ["NO up front fees", "NO commitment or minimums", "NO monthly subscription fee"],
  },
  {
    title: "Simplicity",
    points: [
      "Employee choice of equipment",
      "Fit seamlessly into current workflows",
      "Takes services and leasing off plate without adding any additional complexity",
      "Bring your own assets",
    ],
  },
  {
    title: "Strategic Partner",
    points: [
      "CSM and support team are here to help",
      "Work with you to discover your needs",
      "Understand upcoming budget, lifecycle needs, and organizational changes",
    ],
  },
];

function GlobalPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <img
            src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65fd8b9683df2d4025cda9ad_Benefit%20Img__Global%20Markets.webp"
            alt="Global illustration"
            className="w-[280px] h-auto mx-auto mb-8"
            loading="eager"
          />
          <h1 className="text-[36px] md:text-[48px] font-bold text-aw-dark tracking-tight mb-4">
            All-in-One Global Employee Device Management
          </h1>
          <h2 className="text-[24px] md:text-[32px] font-bold text-aw-dark tracking-tight mb-4">
            allwhere around the world
          </h2>
          <p className="text-[17px] text-aw-muted max-w-[640px] mx-auto">
            Deploy, refresh, and retrieve IT equipment for your employees with next-day delivery from regional warehouses. We'll handle customs and secure returns.
          </p>
        </div>
      </section>

      {/* Country Lists */}
      <section className="bg-aw-cream py-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Object.entries(regions).map(([region, countries]) => (
              <div key={region}>
                <h3 className="text-[18px] font-bold text-aw-dark mb-4">{region}</h3>
                <ul className="space-y-1.5">
                  {countries.map((c) => (
                    <li key={c} className="text-[14px] text-aw-muted">{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why allwhere CTA */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-4">
            Why allwhere is an HR & IT must-have
          </h2>
          <p className="text-[17px] text-aw-muted mb-8">
            International IT procurement and employee laptop returns made easy.
          </p>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-aw-cream pb-16 md:pb-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight text-center mb-4">
            Why Choose allwhere
          </h2>
          <p className="text-[17px] text-aw-muted text-center max-w-[700px] mx-auto mb-12">
            Powerful software and physical operations make our platform the right fit for businesses of all sizes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChoose.map((item) => (
              <div key={item.title} className="bg-aw-beige rounded-[20px] p-8">
                <h3 className="text-[20px] font-bold text-aw-dark mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[15px] text-aw-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-aw-dark mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Screenshot */}
      <section className="bg-aw-cream pb-16 md:pb-24">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="rounded-2xl overflow-hidden">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e108d7a85b2_dashboard.webp"
              alt="allwhere platform"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <Link
            to="/contact"
            className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-3.5 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </Link>
        </div>
      </section>
    </main>
  );
}
