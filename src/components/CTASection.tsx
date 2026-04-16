export default function CTASection() {
  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left - Globe */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759dd03b65a6e94c88b7af5_Deploy%20Section%20Image-p-800.avif"
              alt="Global deployment illustration"
              className="w-full max-w-[400px] h-auto"
              loading="lazy"
            />
          </div>

          {/* Right - CTA text */}
          <div className="flex-1 max-w-[520px]">
            <h2 className="text-[36px] md:text-[44px] font-bold text-aw-dark tracking-tight leading-[1.1] mb-6">
              Save time. Cut costs.
              <br />
              Stay in control.
            </h2>
            <p className="text-[17px] text-aw-muted leading-relaxed mb-8">
              Join hundreds of companies that trust allwhere to manage their employee device lifecycle
              from start to finish.
            </p>
            <a
              href="#"
              className="inline-block text-[15px] font-semibold text-aw-dark bg-aw-yellow px-8 py-3.5 rounded-full hover:bg-aw-yellow-hover transition"
            >
              GET STARTED
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
