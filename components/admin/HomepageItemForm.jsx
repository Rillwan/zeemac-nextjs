"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_MAP, ICON_OPTIONS } from "@/lib/icons";

export default function HomepageItemForm({ section, initialItem }) {
  const router = useRouter();
  const isEdit = Boolean(initialItem);

  const [form, setForm] = useState({
    icon: initialItem?.icon || ICON_OPTIONS[0],
    title: initialItem?.title || "",
    description: initialItem?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isEdit
        ? `/api/homepage-items/${initialItem.id}`
        : "/api/homepage-items";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push(`/admin/homepage-items?section=${section}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const SelectedIcon = ICON_MAP[form.icon];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="card space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Icon
          </label>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-lg bg-brand-light flex items-center justify-center text-brand shrink-0">
              {SelectedIcon && <SelectedIcon className="w-5 h-5" />}
            </span>
            <select
              className="finder-input-light"
              value={form.icon}
              onChange={update("icon")}
            >
              {ICON_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Title *
          </label>
          <input
            required
            className="finder-input-light"
            value={form.title}
            onChange={update("title")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            Description
          </label>
          <textarea
            rows={3}
            className="finder-input-light"
            value={form.description}
            onChange={update("description")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
      </button>
    </form>
  );
}
