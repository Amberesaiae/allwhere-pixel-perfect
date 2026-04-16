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
