import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies | allwhere" },
      { name: "description", content: "See how companies use allwhere to manage their employee device lifecycles." },
      { property: "og:title", content: "Case Studies | allwhere" },
      { property: "og:description", content: "Real stories from allwhere customers." },
    ],
  }),
  component: CaseStudiesPage,
});

const caseStudies = [
  {
    title: "The Right Tech Partner Made the Right Hiring Model Possible at Found",
    company: "Found",
    image: null,
  },
  {
    title: "From Home Warehouse to Streamlined Operations: How Second Nature Scaled Their IT",
    company: "Second Nature",
    image: null,
  },
  {
    title: "How Simspace Eliminated IT Headaches and Scaled From Manual FedEx Runs",
    company: "SimSpace",
    image: null,
  },
  {
    title: "How allwhere Took Linktree From Three-Month Device Retrievals Into One-Click Operations",
    company: "Linktree",
    image: null,
  },
  {
    title: "How allwhere helped dbt Labs scale global IT operations",
    company: "dbt Labs",
    image: null,
  },
  {
    title: "How DroneDeploy scaled laptop deployment from hours to minutes",
    company: "DroneDeploy",
    image: null,
  },
];

function CaseStudiesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h1 className="text-[42px] md:text-[52px] font-bold text-aw-dark tracking-tight text-center mb-12">
            Case Studies
          </h1>

          {/* Featured */}
          <div className="bg-aw-beige rounded-[24px] overflow-hidden mb-12">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 bg-aw-beige-dark/30 min-h-[300px] flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-aw-muted uppercase tracking-wider mb-2">allwhere × DroneDeploy</p>
                  <p className="text-[15px] text-aw-muted">Joseph Mente, Sr. Director DevOps Ops & IT Operations</p>
                </div>
              </div>
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-[12px] font-semibold text-aw-muted uppercase tracking-wider mb-3">Featured Case Study</p>
                <h2 className="text-[24px] md:text-[28px] font-bold text-aw-dark mb-4 leading-snug">
                  How DroneDeploy scaled laptop deployment from hours to minutes
                </h2>
                <p className="text-[14px] text-aw-muted mb-4">Joseph Mente, Senior Director DevOps Ops & IT Operations</p>
                <a href="#" className="text-[14px] font-semibold text-aw-dark hover:opacity-70 transition">
                  READ MORE →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-aw-cream pb-16">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <a key={cs.title} href="#" className="bg-aw-beige rounded-[20px] overflow-hidden hover:bg-aw-beige-dark transition group">
                <div className="h-[180px] bg-aw-beige-dark/30 flex items-center justify-center">
                  <span className="text-[14px] text-aw-muted font-medium">{cs.company}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-[16px] font-bold text-aw-dark leading-snug group-hover:opacity-70 transition">{cs.title}</h3>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[14px] text-aw-muted text-center mt-8">Showing {caseStudies.length} Case Studies</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold text-aw-dark tracking-tight mb-4">
            Tools for modern work
          </h2>
          <p className="text-[15px] text-aw-muted mb-8">
            Subscribe to get a monthly email with all of the articles and guides we've written on how to equip employees to work from anywhere.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-3">
              <input type="text" placeholder="First name*" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
              <input type="email" placeholder="Email*" className="w-full bg-white rounded-lg px-4 py-2.5 text-[14px] border border-aw-beige-dark/30" />
            </div>
          </form>
          <button className="mt-4 text-[14px] font-semibold text-aw-dark bg-aw-yellow px-8 py-3 rounded-full hover:bg-aw-yellow-hover transition">
            SUBSCRIBE
          </button>
        </div>
      </section>
    </main>
  );
}
