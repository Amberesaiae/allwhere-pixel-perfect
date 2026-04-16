export default function StatsStrip() {
  return (
    <section className="bg-bk-cream py-10 border-t border-bk-beige">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          <div className="text-center">
            <p className="text-[36px] font-bold text-bk-dark">500+</p>
            <p className="text-[14px] text-bk-muted">Verified Vendors</p>
          </div>
          <div className="text-center">
            <p className="text-[36px] font-bold text-bk-dark">10k+</p>
            <p className="text-[14px] text-bk-muted">Happy Buyers</p>
          </div>
          <div className="text-center">
            <p className="text-[36px] font-bold text-bk-dark">16</p>
            <p className="text-[14px] text-bk-muted">Ghana Regions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
