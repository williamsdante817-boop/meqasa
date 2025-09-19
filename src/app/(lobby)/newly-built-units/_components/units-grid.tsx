import DeveloperUnitCard, { type DeveloperUnit } from "./developer-unit-card";

interface UnitsGridProps {
  units: DeveloperUnit[];
}

export function UnitsGrid({ units }: UnitsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {units.map((unit, index) => (
        <DeveloperUnitCard
          key={unit.id}
          unit={unit}
          priority={index < 3} // Prioritize first 3 images since we only show 3
        />
      ))}
    </div>
  );
}
