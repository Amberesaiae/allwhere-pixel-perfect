import { Link } from "@tanstack/react-router";

export default function CTASection() {
  return (
    <section className="bg-aw-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left - Circle globe image */}
          <div className="flex-1 flex justify-center">
            <div className="w-[350px] h-[350px] md:w-[420px] md:h-[420px] rounded-full border-2 border-aw-dark overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/67d2e42549802cd631d36db9_card-img__global.webp"
                alt="Global deployment illustration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right - CTA text */}
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
  );
}
