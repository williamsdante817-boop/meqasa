import Link from "next/link";

const propertyTypes = [
  { label: "House", href: "#" },
  { label: "Apartments", href: "#" },
  { label: "Office space", href: "#" },
  { label: "Townhouses", href: "#" },
  { label: "Warehouses", href: "#" },
  { label: "Shops", href: "#" },
  { label: "Commercial", href: "#" },
  { label: "Retail", href: "#" },
  { label: "Land", href: "#" },
  { label: "Guest houses", href: "#" },
];

export default function PropertyTypeLinks() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-3">
      <div>
        <ul className="w-max text-xs">
          {propertyTypes.map((type) => (
            <li className="mb-2" key={type.label}>
              <Link
                className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                href={type.href}
              >
                {type.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
