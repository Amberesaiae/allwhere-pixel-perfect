export default function LifecycleSection() {
  return (
    <section className="bg-aw-cream py-8">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manage the Lifecycle Card */}
          <div className="bg-aw-beige rounded-[24px] overflow-hidden flex flex-col">
            <div className="overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/633497a6357b321a90a7ddc9/635bd65db5eec85fbde6b17c_Grid%20Card%20Image%203.webp"
                alt="Device lifecycle management dashboard"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-10">
              <h3 className="text-[24px] md:text-[28px] font-bold text-aw-dark tracking-tight mb-3">
                <strong>Manage the Lifecycle</strong>
              </h3>
              <p className="text-[16px] text-aw-muted mb-5 leading-relaxed">
                Refresh devices before it's a problem and keep costs under control with centralized dashboards
              </p>
              <ul className="space-y-2">
                {[
                  "Track condition, usage history, warranty status, and resale value",
                  "Set refresh cycles based on real-world usage",
                  "Automate replacements and upgrades",
                  "Maintain optimal inventory throughout team growth with smart allocation rules",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-aw-dark">
                    <span className="w-1.5 h-1.5 rounded-full bg-aw-dark mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Retrieve & Secure Card */}
          <div className="bg-aw-beige rounded-[24px] overflow-hidden flex flex-col">
            <div className="overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/65aab07f6bb1a24891afde1e_Allwhere%20Frame%20834.webp"
                alt="Device retrieval process illustration"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-10">
              <h3 className="text-[24px] md:text-[28px] font-bold text-aw-dark tracking-tight mb-3">
                <strong>Retrieve &amp; Secure</strong>
              </h3>
              <p className="text-[16px] text-aw-muted mb-5 leading-relaxed">
                Recover device while protecting every byte of data
              </p>
              <ul className="space-y-2">
                {[
                  "Send return kits with prepaid shipping labels",
                  "Track every step with full chain-of-custody",
                  "Certified device sanitization for data security",
                  "Secure storage in regional facilities until redeployment",
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
      </div>
    </section>
  );
}
