export default function HeroSection() {
  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left - Text */}
        <div className="flex-1 max-w-[560px]">
          <h1 className="text-[42px] md:text-[52px] lg:text-[58px] font-bold leading-[1.08] tracking-tight text-aw-dark mb-6">
            Put the employee device lifecycle on autopilot
          </h1>
          <p className="text-[17px] leading-[1.6] text-aw-muted mb-8 max-w-[480px]">
            From deploy to retrieval, allwhere manages every stage of your
            employee equipment lifecycle — so your IT team doesn't have to.
          </p>
          <a
            href="#"
            className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-3.5 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </a>
        </div>

        {/* Right - Dashboard mockup */}
        <div className="flex-1 max-w-[620px]">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-aw-beige bg-white">
            <img
              src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759db5db65a6e94c88a1261_HIW%20Hero%20Image%20(1)-p-1080.avif"
              alt="allwhere dashboard showing device management interface"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
