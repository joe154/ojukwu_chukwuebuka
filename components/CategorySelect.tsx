"use client";
import React from "react";

type Props = {
  categories: any[];
  selected: number[];
  onChange: (next: number[]) => void;
};

export default function CategorySelect({ categories, selected, onChange }: Props) {
  const toggle = (id: number) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <label key={c.id} className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded">
          <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
          <span className="text-sm">{c.name}</span>
        </label>
      ))}
    </div>
  );
}
