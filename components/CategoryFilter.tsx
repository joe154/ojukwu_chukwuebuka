"use client";
import React from "react";
import { MotionButton } from "../lib/motion";

type Props = {
  categories: any[];
  selected?: number | null;
  onChange: (id: number | null) => void;
};

export default function CategoryFilter({ categories, selected = null, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <MotionButton
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded ${selected === null ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}
        whileTap={{ scale: 0.97 }}
      >
        All
      </MotionButton>
      {categories.map((c) => (
        <MotionButton
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`px-3 py-1 rounded ${selected === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}
          whileTap={{ scale: 0.97 }}
        >
          {c.name}
        </MotionButton>
      ))}
    </div>
  );
}
