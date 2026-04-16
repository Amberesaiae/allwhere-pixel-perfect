import { Monitor, Shirt, UtensilsCrossed, Sparkles, Home, Car, BookOpen, Wrench, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Home,
  Car,
  BookOpen,
  Wrench,
};

export function getCategoryIcon(iconName: string | null): LucideIcon | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

export const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  used: "Used",
  refurbished: "Refurbished",
};

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  const number = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getCallUrl(phone: string): string {
  return `tel:${phone}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatPrice(price: number, currency = "GHS"): string {
  return `${currency} ${price.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Volta",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];
