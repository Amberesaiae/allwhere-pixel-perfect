export default function ConnectSection() {
  return (
    <section className="bg-aw-teal py-16 mt-8">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="text-center mb-12">
          <h3 className="text-[32px] md:text-[40px] font-bold text-aw-dark tracking-tight mb-3">
            <strong>Connect Your Systems</strong>
          </h3>
          <p className="text-[18px] text-aw-muted max-w-[620px] mx-auto">
            Integrate allwhere with your existing tools to understand where your devices are at any time
          </p>
        </div>

        {/* Row 1: Integrations illustration + text */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-16">
          <div className="flex-1 flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65d7d1c6f4b80346724b74ee_Illustration.svg"
              alt="System integrations illustration showing connected platforms"
              className="w-full max-w-[400px] h-auto"
              loading="lazy"
            />
          </div>
          <div className="flex-1 max-w-[480px]">
            <p className="text-[16px] text-aw-muted leading-relaxed">
              HRIS, MDM, iPaaS integrations and customer-facing APIs. Automatic mapping of devices to employees and departments.
            </p>
          </div>
        </div>

        {/* Row 2: Text + inventory screenshot */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16 mb-16">
          <div className="flex-1 flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/658059ceab3e88d40a1c9a64_ui__it_asset_management_merchandise.png"
              alt="IT asset management merchandise view"
              className="w-full max-w-[400px] h-auto"
              loading="lazy"
            />
          </div>
          <div className="flex-1 max-w-[480px]">
            <p className="text-[16px] text-aw-muted leading-relaxed">
              Import existing inventory for a complete fleet view. Get real-time updates on condition, usage, and location.
            </p>
          </div>
        </div>

        {/* Row 3: Screenshot + text */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 flex justify-center">
            <img
              src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/658059ceab3e88d40a1c9a64_ui__it_asset_management_merchandise.png"
              alt="Example screenshot from product showing merchandise totals"
              className="w-full max-w-[400px] h-auto"
              loading="lazy"
            />
          </div>
          <div className="flex-1 max-w-[480px]">
            <p className="text-[16px] text-aw-muted leading-relaxed">
              Import existing inventory for a complete fleet view. Get real-time updates on condition, usage, and location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
