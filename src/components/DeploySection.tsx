export default function DeploySection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Title */}
        <h2 className="text-[40px] md:text-[48px] font-bold text-center text-aw-dark mb-12 tracking-tight">
          How it works
        </h2>

        {/* Deploy Anywhere Card */}
        <div className="bg-aw-beige rounded-[24px] p-8 md:p-12 lg:p-16">
          <div className="text-center mb-10">
            <h3 className="text-[32px] md:text-[38px] font-bold text-aw-dark tracking-tight mb-3">
              Deploy anywhere
            </h3>
            <p className="text-[17px] text-aw-muted max-w-[560px] mx-auto">
              Ship equipment to employees anywhere in the world — fast and fully managed.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left - Globe illustration */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759dd03b65a6e94c88b7af5_Deploy%20Section%20Image-p-800.avif"
                alt="Global deployment illustration with globe and shipping routes"
                className="w-full max-w-[440px] h-auto"
                loading="lazy"
              />
            </div>

            {/* Right - Description */}
            <div className="flex-1 max-w-[480px]">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-aw-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[14px] font-bold text-aw-dark">1</span>
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-aw-dark mb-1">Choose equipment</h4>
                    <p className="text-[15px] text-aw-muted leading-relaxed">
                      Select from our curated catalog of laptops, monitors, peripherals, and more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-aw-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[14px] font-bold text-aw-dark">2</span>
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-aw-dark mb-1">Enter employee details</h4>
                    <p className="text-[15px] text-aw-muted leading-relaxed">
                      Provide the shipping address — domestic or international — and we handle the rest.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-aw-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[14px] font-bold text-aw-dark">3</span>
                  </div>
                  <div>
                    <h4 className="text-[17px] font-semibold text-aw-dark mb-1">We deliver it</h4>
                    <p className="text-[15px] text-aw-muted leading-relaxed">
                      Equipment is configured, packed, and shipped directly to your employee's door.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
