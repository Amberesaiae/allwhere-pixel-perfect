import { Link } from "@tanstack/react-router";
import { Monitor, Shirt, UtensilsCrossed, Sparkles, Home, Car, BookOpen, Wrench } from "lucide-react";

const categories = [
  { name: "Electronics", slug: "electronics", icon: Monitor, desc: "Phones, laptops, accessories & gadgets", color: "bg-blue-50 border-blue-200" },
  { name: "Fashion", slug: "fashion", icon: Shirt, desc: "Clothing, shoes, bags & jewelry", color: "bg-pink-50 border-pink-200" },
  { name: "Food & Groceries", slug: "food-groceries", icon: UtensilsCrossed, desc: "Fresh produce, spices & packaged goods", color: "bg-green-50 border-green-200" },
  { name: "Health & Beauty", slug: "health-beauty", icon: Sparkles, desc: "Skincare, cosmetics & wellness products", color: "bg-purple-50 border-purple-200" },
  { name: "Home & Living", slug: "home-living", icon: Home, desc: "Furniture, decor & kitchen essentials", color: "bg-amber-50 border-amber-200" },
  { name: "Auto & Parts", slug: "auto-parts", icon: Car, desc: "Vehicle parts, tools & accessories", color: "bg-slate-50 border-slate-200" },
  { name: "Books & Stationery", slug: "books-stationery", icon: BookOpen, desc: "Textbooks, office supplies & art materials", color: "bg-orange-50 border-orange-200" },
  { name: "Services", slug: "services", icon: Wrench, desc: "Repairs, tailoring, printing & more", color: "bg-teal-50 border-teal-200" },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-bk-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
            Shop by Category
          </h2>
          <p className="text-[18px] text-bk-muted max-w-[600px] mx-auto">
            From electronics to local food, find everything you need from verified Ghanaian vendors
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/discover"
              search={{ category: cat.slug }}
              className={`${cat.color} border rounded-2xl p-5 md:p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all group`}
            >
              <cat.icon className="w-10 h-10 mx-auto mb-3 text-bk-dark" />
              <h3 className="text-[15px] md:text-[16px] font-bold text-bk-dark mb-1">{cat.name}</h3>
              <p className="text-[12px] md:text-[13px] text-bk-muted leading-snug">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
