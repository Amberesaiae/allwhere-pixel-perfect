export default function ConnectSection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="bg-aw-teal rounded-[24px] p-8 md:p-12 lg:p-16">
          <div className="text-center mb-12">
            <h3 className="text-[32px] md:text-[38px] font-bold text-aw-dark tracking-tight mb-3">
              Connect your systems
            </h3>
            <p className="text-[17px] text-aw-muted max-w-[580px] mx-auto">
              Integrate allwhere with the tools you already use — HRIS, MDM, SSO, and more.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-12">
            {/* Left - Integration illustration */}
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759de8c72e86c6f25c73a9e_Integration%20Section%20Image-p-800.avif"
                alt="System integrations illustration showing connected platforms"
                className="w-full max-w-[440px] h-auto"
                loading="lazy"
              />
            </div>

            {/* Right - Description */}
            <div className="flex-1 max-w-[480px]">
              <h4 className="text-[22px] font-bold text-aw-dark mb-4">
                Seamless integrations
              </h4>
              <p className="text-[15px] text-aw-muted leading-relaxed mb-6">
                Connect your HR system to automate onboarding and offboarding workflows.
                Sync with your MDM to ensure devices are enrolled and compliant from day one.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Okta", "BambooHR", "Jamf", "Workday", "Slack", "Rippling"].map((name) => (
                  <span
                    key={name}
                    className="px-4 py-2 rounded-full bg-white/60 text-[13px] font-medium text-aw-dark border border-white/40"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory stats card */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 flex justify-center">
              <img
                src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759deb772e86c6f25c7f68a_Inventory%20Stats%20Image-p-800.avif"
                alt="Inventory statistics dashboard"
                className="w-full max-w-[440px] h-auto rounded-2xl"
                loading="lazy"
              />
            </div>
            <div className="flex-1 max-w-[480px]">
              <h4 className="text-[22px] font-bold text-aw-dark mb-4">
                Complete inventory visibility
              </h4>
              <p className="text-[15px] text-aw-muted leading-relaxed">
                See every device across your organization in real time. Know what's deployed,
                what's in storage, and what needs attention — all from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
