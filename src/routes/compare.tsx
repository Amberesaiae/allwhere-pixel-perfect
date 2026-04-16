import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare | allwhere" },
      { name: "description", content: "See how allwhere compares to other equipment management solutions." },
      { property: "og:title", content: "Compare | allwhere" },
      { property: "og:description", content: "See how allwhere stacks up against competitors." },
    ],
  }),
  component: ComparePage,
});

const competitors = [
  "Dots", "Fleet", "Remote Retrieval", "CDW",
  "Rippling", "Deel IT (Formally Hofy)", "Workwize", "Unduit",
  "Retriever", "Net Universe", "ReReady", "LaptopReturn",
  "ITmann", "DART Returns", "Device Rescue", "ComputerCare",
  "Hofy", "GroWrk", "Firstbase",
];

const whyChoose = [
  {
    title: "Flexibility",
    points: ["NO up front fees", "NO commitment or minimums", "NO monthly subscription fee"],
  },
  {
    title: "Simplicity",
    points: [
      "Employee choice of equipment",
      "Fit seamlessly into current workflows with integrations",
      "Takes services and leasing off plate without adding any additional complexity",
      "Bring your own assets",
    ],
  },
  {
    title: "Strategic Partner",
    points: [
      "CSM and support team are here to help",
      "We'll work with you to discover your needs",
      "Understand upcoming budget, lifecycle needs, and organizational changes",
    ],
  },
];

const filters = ["Identity", "HR", "IT", "Security"];

function ComparePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <img
            src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/63a278469eb881535a837dc3_remote-onboarding-lifecycle-management.webp"
            alt="Desk setup"
            className="w-[320px] h-auto mx-auto mb-10 rounded-2xl"
            loading="eager"
          />
          <p className="text-[17px] text-aw-muted max-w-[640px] mx-auto mb-8">
            See how allwhere can help you procure, retrieve, and store equipment quickly, easily, and globally.
          </p>
          <div className="rounded-2xl overflow-hidden max-w-[800px] mx-auto">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/637be80ebdeb9e108d7a85b2_dashboard.webp"
              alt="allwhere platform screenshot"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight text-center mb-4">
            Why Choose allwhere
          </h2>
          <p className="text-[17px] text-aw-muted text-center max-w-[700px] mx-auto mb-12">
            allwhere's user-friendly software, world-class logistics, and premium customer experience help you save time and cost on equipment management for your distributed team.
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

      {/* Comparison Grid */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight text-center mb-4">
            allwhere vs. other equipment management solutions
          </h2>
          <p className="text-[17px] text-aw-muted text-center mb-8">
            See what allwhere has to offer versus our competitors.
          </p>

          {/* Filters */}
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition ${
                  activeFilter === f ? "bg-aw-dark text-white" : "bg-aw-beige text-aw-dark hover:bg-aw-beige-dark"
                }`}
              >
                {f}
              </button>
            ))}
            <button onClick={() => setActiveFilter(null)} className="text-[13px] text-aw-muted hover:text-aw-dark transition">
              Reset filters
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitors.map((comp) => (
              <a
                key={comp}
                href="#"
                className="bg-aw-beige rounded-[16px] p-5 hover:bg-aw-beige-dark transition text-center"
              >
                <p className="text-[14px] font-semibold text-aw-dark">allwhere vs. {comp}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-aw-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-4">
            Why allwhere is an HR & IT must-have
          </h2>
          <p className="text-[17px] text-aw-muted mb-8">
            IT procurement services and employee laptop returns made easy.
          </p>
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
