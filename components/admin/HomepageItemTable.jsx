"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ICON_MAP } from "@/lib/icons";

export default function HomepageItemTable({ section, initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/homepage-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((list) => list.filter((i) => i.id !== id));
      router.refresh();
    } catch {
      alert("Could not delete this item. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No items yet — add your first one.
      </p>
    );
  }

  return (
    <div className="card overflow-x-auto w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Icon</th>
            <th className="pb-3 font-semibold">Title</th>
            <th className="pb-3 font-semibold">Description</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <tr
                key={item.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3">
                  <span className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center text-brand">
                    {Icon && <Icon className="w-4 h-4" />}
                  </span>
                </td>
                <td className="py-3 font-medium text-brand-navy">
                  {item.title}
                </td>
                <td className="py-3 text-slate-500 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/homepage-items/${item.id}/edit?section=${section}`}
                      aria-label="Edit"
                      className="text-slate-400 hover:text-brand"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      aria-label="Delete"
                      className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
