import { Link } from "@tanstack/react-router";

const categories = [
  { name: "Electronics", icon: "💻", desc: "Phones, laptops, accessories & gadgets", color: "bg-blue-50 border-blue-200" },
  { name: "Fashion", icon: "👗", desc: "Clothing, shoes, bags & jewelry", color: "bg-pink-50 border-pink-200" },
  { name: "Food & Groceries", icon: "🥘", desc: "Fresh produce, spices & packaged goods", color: "bg-green-50 border-green-200" },
  { name: "Health & Beauty", icon: "✨", desc: "Skincare, cosmetics & wellness products", color: "bg-purple-50 border-purple-200" },
  { name: "Home & Living", icon: "🏠", desc: "Furniture, décor & kitchen essentials", color: "bg-amber-50 border-amber-200" },
  { name: "Auto & Parts", icon: "🚗", desc: "Vehicle parts, tools & accessories", color: "bg-slate-50 border-slate-200" },
  { name: "Books & Stationery", icon: "📚", desc: "Textbooks, office supplies & art materials", color: "bg-orange-50 border-orange-200" },
  { name: "Services", icon: "🔧", desc: "Repairs, tailoring, printing & more", color: "bg-teal-50 border-teal-200" },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-bk-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
            Shop by Category
          </h2>
          <p className="text-[18px] text-bk-muted max-w-[600px] mx-auto">
            From electronics to local food, find everything you need from verified Ghanaian vendors
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/discover"
              className={`${cat.color} border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all group`}
            >
              <span className="text-[40px] block mb-3">{cat.icon}</span>
              <h3 className="text-[16px] font-bold text-bk-dark mb-1">{cat.name}</h3>
              <p className="text-[13px] text-bk-muted leading-snug">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
