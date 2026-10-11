import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HomepageItemTable from "@/components/admin/HomepageItemTable";

const SECTIONS = [
  { key: "categories", label: "Category Cards" },
  { key: "industries", label: "Industries" },
  { key: "whychoose", label: "Why Choose Us" },
];

export const metadata = { title: "Homepage Items" };
export const dynamic = "force-dynamic";

export default async function HomepageItemsPage({ searchParams }) {
  const params = await searchParams;
  const section = SECTIONS.some((s) => s.key === params?.section)
    ? params.section
    : "categories";

  const items = await prisma.homepageItem.findMany({
    where: { section },
    orderBy: { order: "asc" },
  });

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-brand-navy mb-4">Homepage Items</h2>

      <div className="flex gap-2 mb-6">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/homepage-items?section=${s.key}`}
            className={`text-sm font-semibold px-4 py-2 rounded-full ${section === s.key ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Link
          href={`/admin/homepage-items/new?section=${section}`}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add Item
        </Link>
      </div>

      <HomepageItemTable section={section} initialItems={items} />
    </div>
  );
}
