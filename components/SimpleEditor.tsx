"use client";
import React, { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SimpleEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div
      ref={ref}
      onInput={() => onChange(ref.current?.innerHTML || "")}
      contentEditable
      suppressContentEditableWarning
      className="min-h-[120px] border rounded px-3 py-2 bg-white dark:bg-gray-900"
    />
  );
}
