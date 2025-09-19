import {
  Building,
  Coffee,
  Cross,
  GraduationCap,
  Landmark,
  Plane,
  ShoppingCart,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

type CategoryType =
  | "airport"
  | "mall"
  | "school"
  | "cafe"
  | "office"
  | "restaurant"
  | "hospital"
  | "bank";

interface CategoryIconProps {
  category: CategoryType;
  color?: string;
  size?: number;
}

export default function getCategoryIcon(category: CategoryType): LucideIcon {
  const categoryMap: Record<CategoryType, LucideIcon> = {
    airport: Plane,
    mall: ShoppingCart,
    school: GraduationCap,
    cafe: Coffee,
    office: Building,
    restaurant: UtensilsCrossed,
    hospital: Cross,
    bank: Landmark,
  };

  return categoryMap[category.toLowerCase() as CategoryType] || Building;
}

export function getCategoryColor(category: CategoryType): string {
  const colorMap: Record<CategoryType, string> = {
    airport: "text-rose-500 bg-rose-50",
    mall: "text-pink-500 bg-pink-50",
    school: "text-amber-500 bg-amber-50",
    cafe: "text-emerald-500 bg-emerald-50",
    office: "text-sky-500 bg-sky-50",
    restaurant: "text-orange-500 bg-orange-50",
    hospital: "text-red-500 bg-red-50",
    bank: "text-indigo-500 bg-indigo-50",
  };

  return (
    colorMap[category.toLowerCase() as CategoryType] ||
    "text-gray-500 bg-gray-50"
  );
}
export function CategoryIcon({
  category,
  color,
  size = 24,
}: CategoryIconProps) {
  const Icon = getCategoryIcon(category);
  const defaultColor = getCategoryColor(category);
  const colorClass = color ?? defaultColor;

  return (
    <div
      className={`rounded-lg p-2 ${colorClass} flex items-center justify-center`}
    >
      <Icon size={size} strokeWidth={1.5} />
    </div>
  );
}
