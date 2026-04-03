"use client";
import useSWR from "swr";
import api from "../../lib/api";
import { motion } from "framer-motion";

// Workaround for some TypeScript/framer-motion combos where
// motion.* element factories' props are inferred with `unknown`.
// Cast the specific factories to `any` here to allow `className` and HTML attrs.
const MotionDiv: any = motion.div as any;
const MotionSpan: any = motion.span as any;
const MotionP: any = motion.p as any;

const fetcher = (url: string) => api.get(url).then((r) => r.data);

const timeline = [
  { year: '2024', title: 'Started freelancing', body: 'Built initial portfolio and first client sites.' },
  { year: '2022', title: 'Senior developer', body: 'Worked on production React/Node applications.' },
  { year: '2020', title: 'Graduated', body: 'Completed degree in Computer Science.' },
];

export default function About() {
  const { data: skills } = useSWR('/skills', fetcher);
  return (
    <section className="max-w-4xl mx-auto py-8">
      <MotionDiv initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl">About</h2>
      </MotionDiv>
      <MotionDiv initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p className="mt-4 prose">Brief bio goes here — highlight your focus, technology preferences, and what you build.</p>
      </MotionDiv>

      <div className="mt-8">
        <h3 className="text-xl mb-3">Timeline</h3>
        <div className="space-y-4">
          {timeline.map((t) => (
            <MotionDiv key={t.year} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-4 bg-slate-800 rounded">
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-slate-400">{t.year}</div>
              </div>
              <div className="text-sm mt-1 text-slate-300">{t.body}</div>
            </MotionDiv>
          ))}
        </div>
      </div>

      <MotionDiv className="mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3 className="text-xl mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {!skills
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-20 bg-slate-700 rounded animate-pulse" />
              ))
            : skills.map((s: any) => (
                <MotionSpan key={s.id} className="px-2 py-1 bg-slate-800 rounded text-sm" whileHover={{ scale: 1.03 }}>
                  {s.name}
                </MotionSpan>
              ))}
        </div>
      </MotionDiv>
    </section>
  );
}
