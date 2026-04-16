import { Link } from "@tanstack/react-router";
import { Smartphone, UtensilsCrossed, Shirt, ArrowRight } from "lucide-react";

const tiles = [
  {
    name: "Phones & Electronics",
    desc: "Latest smartphones, laptops & gadgets",
    slug: "electronics",
    icon: Smartphone,
    bg: "bg-bk-teal",
    accent: "text-bk-dark",
  },
  {
    name: "Food & Groceries",
    desc: "Fresh produce, spices & local goods",
    slug: "food-groceries",
    icon: UtensilsCrossed,
    bg: "bg-bk-yellow",
    accent: "text-bk-dark",
  },
  {
    name: "Fashion & Apparel",
    desc: "African prints, shoes & accessories",
    slug: "fashion",
    icon: Shirt,
    bg: "bg-bk-orange",
    accent: "text-white",
  },
];

export default function CategoryTiles() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-bk-dark tracking-tight">Top Categories</h2>
            <p className="text-[14px] md:text-[15px] text-bk-muted mt-1">Find what you need from Ghana's top sellers</p>
          </div>
          <Link to="/discover" className="hidden md:inline-flex items-center gap-1 text-[14px] font-semibold text-bk-dark hover:text-bk-orange transition">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiles.map((t) => (
            <Link
              key={t.slug}
              to="/discover"
              search={{ category: t.slug, tab: "listings" }}
              className={`${t.bg} ${t.accent} rounded-2xl p-6 md:p-7 hover:shadow-lg hover:-translate-y-0.5 transition group relative overflow-hidden min-h-[180px] flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-[20px] md:text-[24px] font-bold leading-tight">{t.name}</h3>
                <p className="text-[13px] md:text-[14px] opacity-80 mt-1.5 max-w-[80%]">{t.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-[13px] font-semibold inline-flex items-center gap-1">Shop now <ArrowRight className="w-4 h-4" /></span>
                <t.icon className="w-12 h-12 md:w-14 md:h-14 opacity-60 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
