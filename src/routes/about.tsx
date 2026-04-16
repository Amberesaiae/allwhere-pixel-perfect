import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | allwhere" },
      { name: "description", content: "Learn about allwhere's values, benefits, and open roles." },
      { property: "og:title", content: "About | allwhere" },
      { property: "og:description", content: "Learn about allwhere's values, benefits, and open roles." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Customer Obsessed", desc: "We put customers at the center of everything we do." },
  { title: "Ownership Mentality", desc: "We take responsibility and act like owners." },
  { title: "Move Fast", desc: "Speed is a feature. We ship quickly and iterate." },
  { title: "Transparency", desc: "We default to open communication and honest feedback." },
  { title: "Team First", desc: "We win together. Collaboration beats competition." },
  { title: "Think Big", desc: "We dream big and pursue ambitious goals." },
];

const benefits = [
  "Competitive salary & equity",
  "Comprehensive health, dental & vision",
  "Unlimited PTO",
  "Remote-first culture",
  "Home office stipend",
  "Professional development budget",
  "401(k) matching",
  "Parental leave",
];

const roles = [
  { dept: "Engineering", title: "Senior Full Stack Engineer", location: "New York, NY" },
  { dept: "Operations", title: "Business Operations Analyst", location: "New York, NY" },
  { dept: "Operations", title: "Operations Specialist, Asset Management", location: "New York, NY" },
  { dept: "Operations", title: "Operations Specialist, Order Management", location: "New York, NY" },
  { dept: "Operations", title: "Operations Specialist, Procurement", location: "New York, NY" },
  { dept: "Operations", title: "Strategic Analytics Manager", location: "New York, NY" },
  { dept: "Sales and Customer Success", title: "Account Manager", location: "New York, NY" },
  { dept: "Sales and Customer Success", title: "Senior Manager, Account Management", location: "New York City, NY" },
];

function AboutPage() {
  const depts = [...new Set(roles.map((r) => r.dept))];

  return (
    <main>
      {/* Hero */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <img
            src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65fd8b9683df2d4025cda9ad_Benefit%20Img__Global%20Markets.webp"
            alt="Globe illustration"
            className="w-[280px] h-auto mx-auto mb-10"
            loading="eager"
          />
          <h1 className="text-[42px] md:text-[52px] font-bold text-aw-dark tracking-tight mb-6">Our values</h1>
        </div>
      </section>

      {/* Values */}
      <section className="bg-aw-cream pb-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-aw-beige rounded-[20px] p-8">
                <h3 className="text-[20px] font-bold text-aw-dark mb-3">{v.title}</h3>
                <p className="text-[15px] text-aw-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight text-center mb-12">
            Benefits of working for allwhere
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b} className="bg-aw-beige rounded-[16px] p-6 text-center">
                <p className="text-[15px] font-medium text-aw-dark">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight text-center mb-12">
            Browse open roles
          </h2>
          {depts.map((dept) => (
            <div key={dept} className="mb-10">
              <h3 className="text-[14px] font-semibold text-aw-muted uppercase tracking-wider mb-4">{dept}</h3>
              <div className="space-y-3">
                {roles
                  .filter((r) => r.dept === dept)
                  .map((role) => (
                    <div key={role.title} className="bg-aw-beige rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-[17px] font-semibold text-aw-dark">{role.title}</h4>
                        <p className="text-[14px] text-aw-muted">Location: {role.location}</p>
                      </div>
                      <a href="#" className="text-[14px] font-semibold text-aw-dark hover:opacity-70 transition">+ View details</a>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <p className="text-center text-[13px] text-aw-muted mt-8">POWERED BY <span className="font-semibold">JazzHR</span></p>
        </div>
      </section>
    </main>
  );
}
