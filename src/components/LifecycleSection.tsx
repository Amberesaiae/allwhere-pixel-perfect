export default function LifecycleSection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manage the Lifecycle Card */}
          <div className="bg-aw-beige rounded-[24px] p-8 md:p-10 flex flex-col">
            <div className="rounded-2xl overflow-hidden mb-8 border border-aw-beige-dark/30">
              <img
                src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759dda9cfbe1e82ea5f1c2e_Manage%20Section%20Image-p-800.avif"
                alt="Device lifecycle management dashboard"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <h3 className="text-[28px] md:text-[32px] font-bold text-aw-dark tracking-tight mb-3">
              Manage the lifecycle
            </h3>
            <p className="text-[15px] text-aw-muted mb-5 leading-relaxed">
              Track every asset from procurement to retirement in one place.
            </p>
            <ul className="space-y-3">
              {[
                "Real-time asset tracking and status updates",
                "Automated inventory management",
                "Employee self-service portal",
                "Integration with your existing HRIS and MDM tools",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-aw-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-aw-dark mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Retrieve & Secure Card */}
          <div className="bg-aw-beige rounded-[24px] p-8 md:p-10 flex flex-col">
            <div className="rounded-2xl overflow-hidden mb-8 border border-aw-beige-dark/30">
              <img
                src="https://cdn.prod.website-files.com/6616a4e4e7e28e5214e3642c/6759dda90f22a5b4f60a2a3f_Retrieval%20Section%20Image-p-800.avif"
                alt="Device retrieval and security dashboard"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <h3 className="text-[28px] md:text-[32px] font-bold text-aw-dark tracking-tight mb-3">
              Retrieve & secure
            </h3>
            <p className="text-[15px] text-aw-muted mb-5 leading-relaxed">
              Get devices back from employees quickly and securely — anywhere in the world.
            </p>
            <ul className="space-y-3">
              {[
                "Automated retrieval workflows for offboarding",
                "Pre-paid shipping labels sent to employees",
                "Secure chain of custody tracking",
                "Data wiping and device sanitization",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-aw-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-aw-dark mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
