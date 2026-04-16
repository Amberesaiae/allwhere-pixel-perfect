export default function Footer() {
  return (
    <footer className="bg-aw-footer pt-16 pb-8">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Top: Logo + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <span className="text-[22px] font-bold tracking-tight text-aw-dark">allwhere</span>
          <a
            href="#"
            className="text-[14px] font-semibold text-aw-dark bg-aw-yellow px-6 py-3 rounded-full hover:bg-aw-yellow-hover transition"
          >
            GET STARTED
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div>
            <p className="text-[14px] text-aw-muted uppercase tracking-wider mb-2 font-medium">
              Why allwhere?
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="text-[48px] font-bold text-aw-dark leading-none">96%</p>
              <p className="text-[15px] text-aw-muted mt-1">on-time delivery rate</p>
            </div>
            <div>
              <p className="text-[48px] font-bold text-aw-dark leading-none">91%</p>
              <p className="text-[15px] text-aw-muted mt-1">device retrieval rate</p>
            </div>
          </div>
        </div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="text-[14px] font-semibold text-aw-dark mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {["How it works", "Pricing", "Laptop retrieval", "Equipment catalog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[14px] text-aw-muted hover:text-aw-dark transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-aw-dark mb-4 uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-3">
              {["Onboarding", "Offboarding", "Remote teams", "IT asset management"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[14px] text-aw-muted hover:text-aw-dark transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-aw-dark mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {["Blog", "Case studies", "Help center", "API docs"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[14px] text-aw-muted hover:text-aw-dark transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-aw-dark mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {["About", "Careers", "Contact", "Privacy policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[14px] text-aw-muted hover:text-aw-dark transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-aw-beige-dark/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-aw-muted">
            © {new Date().getFullYear()} allwhere. All rights reserved.
          </p>
          <div className="flex gap-5">
            {/* Social icons as simple text links */}
            {["LinkedIn", "Twitter", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[13px] text-aw-muted hover:text-aw-dark transition"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
