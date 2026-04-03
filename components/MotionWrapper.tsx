"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../lib/motion";
import { usePathname } from "next/navigation";

export default function MotionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32 }}
        className="w-full"
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}
