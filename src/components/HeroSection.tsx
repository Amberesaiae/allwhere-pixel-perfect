import { Link } from "@tanstack/react-router";

export default function HeroSection() {
  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left - Text */}
        <div className="flex-1 max-w-[560px]">
          <h1 className="text-[42px] md:text-[52px] lg:text-[58px] font-bold leading-[1.08] tracking-tight text-aw-dark mb-6">
            Put the employee device lifecycle on autopilot
          </h1>
          <p className="text-[18px] leading-[1.6] text-aw-muted mb-8 max-w-[500px]">
            One platform to manage the entire IT device lifecycle — from procurement to secure retrieval — with global reach and real-time control that lets your team stay focused on what matters.
          </p>
          <Link
            to="/contact"
            className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-4 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </Link>
        </div>

        {/* Right - Dashboard mockup */}
        <div className="flex-1 max-w-[620px]">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-aw-beige bg-white">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/68d9942cb54149975c81f10b_hiw-hero-img.png"
              alt="allwhere dashboard showing device management interface with orders, assets, and time saved"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
