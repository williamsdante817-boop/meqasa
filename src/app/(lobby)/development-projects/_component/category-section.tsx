import EstablishmentItem, { type Establishment as EstablishmentItemType } from "./establishment-item";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryIcon } from "./category-icon";
import type { ReactNode } from "react";
// import { Card, CardHeader, CardContent } from "../ui/Card";
// import CategoryIcon from "../icons/CategoryIcon";

export interface Establishment {
  id: string | number;
  name: string;
  distance: number | string;
  unit?: "km" | "mi";
}

interface CategorySectionProps {
  title: string;
  category: string;
  establishments: Establishment[];
  icon?: ReactNode;
}

type CategoryType =
  | "airport"
  | "mall"
  | "school"
  | "cafe"
  | "office"
  | "restaurant"
  | "hospital"
  | "bank";

export default function CategorySection({
  title,
  category,
  establishments,
  icon,
}: CategorySectionProps) {
  const normalizeType = (cat: string): EstablishmentItemType['type'] => {
    const c = cat.toLowerCase();
    if (c.includes('airport')) return 'airport';
    if (c.includes('school')) return 'school';
    if (c.includes('hospital')) return 'hospital';
    if (c.includes('bank')) return 'bank';
    // Map mall/cafe/restaurant/office/others to supermarket bucket
    return 'supermarket';
  };

  const toMeters = (distance: number | string, unit?: 'km' | 'mi'): number => {
    const n = typeof distance === 'string' ? parseFloat(distance) : distance;
    if (!isFinite(n)) return 0;
    if (unit === 'mi') return n * 1609.34;
    // default km
    return n * 1000;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          {icon ?? (
            <CategoryIcon category={category as CategoryType} size={20} />
          )}
          <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        {establishments.map((est) => {
          const item: EstablishmentItemType = {
            id: String(est.id),
            name: est.name,
            address: '',
            distance: toMeters(est.distance, est.unit),
            type: normalizeType(category),
          };
          return (
            <EstablishmentItem
              key={item.id}
              establishment={item}
              variant="compact"
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
