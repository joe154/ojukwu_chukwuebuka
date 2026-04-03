// Convenience wrappers that cast framer-motion factories to `any` so TypeScript
// doesn't reject common HTML attributes like `className` in some setups.
// Import the named Motion* components from this file instead of using `motion.*` directly.

import { motion } from 'framer-motion';

export const MotionDiv: any = motion.div as any;
export const MotionSection: any = motion.section as any;
export const MotionH2: any = motion.h2 as any;
export const MotionP: any = motion.p as any;
export const MotionArticle: any = motion.article as any;
export const MotionSpan: any = motion.span as any;
export const MotionForm: any = motion.form as any;
export const MotionButton: any = motion.button as any;

export default motion as any;
