export default function DeploySection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1080px] px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight">
            <strong>How It Works</strong>
          </h2>
        </div>

        {/* Deploy Anywhere */}
        <section className="mb-16">
          <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight text-center mb-3">
            <strong>Deploy Anywhere</strong>
          </h3>
          <p className="text-[18px] text-aw-muted text-center max-w-[620px] mx-auto mb-10">
            Ship fully configured devices to employees around the world without lifting a finger
          </p>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left - Globe illustration */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65fd8b9683df2d4025cda9ad_Benefit%20Img__Global%20Markets.webp"
                alt="Global deployment illustration showing world map with shipping routes"
                className="w-full max-w-[425px] h-auto"
                loading="lazy"
              />
            </div>

            {/* Right - Description */}
            <div className="flex-1 max-w-[480px]">
              <p className="text-[16px] text-aw-muted leading-relaxed">
                We source to your device specs, ship fast from regional warehouses, and manage global logistics. Every device arrives work-ready, no IT setup required.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
