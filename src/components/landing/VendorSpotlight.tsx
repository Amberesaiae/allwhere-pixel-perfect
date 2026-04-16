import { Link } from "@tanstack/react-router";

const vendors = [
  {
    name: "Kwame's Tech Hub",
    location: "Accra, Osu",
    category: "Electronics",
    rating: 4.9,
    reviews: 128,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    desc: "Premium smartphones, laptops & accessories with warranty. Trusted by 1,000+ buyers.",
  },
  {
    name: "Ama's Fashion House",
    location: "Kumasi, Adum",
    category: "Fashion",
    rating: 4.8,
    reviews: 95,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    desc: "Handmade African prints, modern styles & custom tailoring. Ships across Ghana.",
  },
  {
    name: "FreshFarm GH",
    location: "Tamale, Central",
    category: "Food & Groceries",
    rating: 4.7,
    reviews: 64,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    desc: "Organic vegetables, shea butter & northern spices delivered fresh to your door.",
  },
];

export default function VendorSpotlight() {
  return (
    <section className="bg-bk-beige py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="text-center mb-14">
          <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
            Featured Vendors
          </h2>
          <p className="text-[18px] text-bk-muted max-w-[600px] mx-auto">
            Meet some of Ghana's top-rated vendors already thriving on BlueKiosk
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {vendors.map((v) => (
            <div key={v.name} className="bg-bk-cream rounded-2xl p-6 md:p-8 hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={v.avatar}
                  alt={v.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-bk-yellow"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-[17px] font-bold text-bk-dark">{v.name}</h3>
                  <p className="text-[13px] text-bk-muted">{v.location}</p>
                </div>
              </div>
              <p className="text-[15px] text-bk-muted leading-relaxed mb-5">{v.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-bk-yellow text-[16px]">★</span>
                  <span className="text-[15px] font-bold text-bk-dark">{v.rating}</span>
                  <span className="text-[13px] text-bk-muted">({v.reviews} reviews)</span>
                </div>
                <span className="text-[12px] font-semibold text-bk-muted bg-bk-beige px-3 py-1 rounded-full">
                  {v.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/discover"
            search={{ tab: "kiosks" }}
            className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
          >
            View All Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
