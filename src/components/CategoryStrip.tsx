import { Link } from "@tanstack/react-router";
import { Monitor, Shirt, UtensilsCrossed, Sparkles, Home, Car, BookOpen, Wrench, LayoutGrid, Store } from "lucide-react";

const categories = [
  { name: "All", slug: "", icon: LayoutGrid },
  { name: "Electronics", slug: "electronics", icon: Monitor },
  { name: "Fashion", slug: "fashion", icon: Shirt },
  { name: "Food", slug: "food-groceries", icon: UtensilsCrossed },
  { name: "Health & Beauty", slug: "health-beauty", icon: Sparkles },
  { name: "Home", slug: "home-living", icon: Home },
  { name: "Auto", slug: "auto-parts", icon: Car },
  { name: "Books", slug: "books-stationery", icon: BookOpen },
  { name: "Services", slug: "services", icon: Wrench },
];

export default function CategoryStrip() {
  return (
    <div className="bg-white border-b border-bk-beige">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 -mx-1 px-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug || "all"}
              to="/discover"
              search={cat.slug ? { category: cat.slug, tab: "listings", q: "" } : { tab: "listings", category: "", q: "" }}
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-bk-muted hover:text-bk-dark hover:bg-bk-page transition whitespace-nowrap"
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </Link>
          ))}
          <span className="shrink-0 w-px h-5 bg-bk-beige mx-1" />
          <Link
            to="/discover"
            search={{ tab: "kiosks", category: "", q: "" }}
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold text-bk-dark bg-bk-yellow/40 hover:bg-bk-yellow transition whitespace-nowrap"
          >
            <Store className="w-4 h-4" />
            Top Vendors
          </Link>
        </div>
      </div>
    </div>
  );
}
