"use client";
import React from "react";
import { MotionDiv } from "../lib/motion";
import { usePathname } from "next/navigation";

export default function MotionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <MotionDiv
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full pointer-events-auto"
    >
      {children}
    </MotionDiv>
  );
}
