"use client";

import useSWR from "swr";
import api from "../../lib/api";
import { motion } from "framer-motion";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Card } from "../../components/ui/Card";
import { User, Briefcase, Code2, Target, Award, BookOpen } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

const timeline = [
  { year: "2024", title: "Started Freelancing", body: "Built initial portfolio and first client sites. Worked on various web projects." },
  { year: "2022", title: "Senior Developer", body: "Worked on production React/Node applications with enterprise clients." },
  { year: "2020", title: "Graduated", body: "Completed degree in Computer Science from a top university." },
  { year: "2019", title: "First Dev Role", body: "Started career as junior developer at a startup." },
];

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "Expertise in modern JavaScript frameworks, Node.js, and cloud technologies.",
  },
  {
    icon: Briefcase,
    title: "Project Leadership",
    description: "Led cross-functional teams and managed complex projects from concept to launch.",
  },
  {
    icon: Target,
    title: "Problem Solving",
    description: "Passionate about finding elegant solutions to complex technical challenges.",
  },
  {
    icon: Award,
    title: "Best Practices",
    description: "Advocate for clean code, testing, and sustainable development practices.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function About() {
  const { data: skills, isLoading: skillsLoading } = useSWR("/skills", fetcher);

  return (
    <motion.section className="pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Hero Section */}
      <motion.div
        className="space-y-6 mb-16 sm:mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
              About Me
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Full-Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Developer & Designer</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            I'm a passionate full-stack developer with 5+ years of experience building web applications. I specialize in creating scalable, high-performance solutions using modern technologies. My focus is on delivering exceptional user experiences while maintaining clean, maintainable code.
          </p>
        </div>
      </motion.div>

      {/* Highlights Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="h-full">
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        className="mb-16 sm:mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Briefcase className="w-5 h-5 text-primary-400" />
            <h2 className="text-3xl sm:text-4xl font-bold">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Journey</span>
            </h2>
          </motion.div>

          {/* Timeline Items */}
          <div className="space-y-4 md:space-y-0">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative md:flex md:gap-8"
              >
                {/* Timeline marker */}
                <div className="md:flex-shrink-0 flex items-start">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-500 bg-slate-900">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400" />
                    </div>
                    {index < timeline.length - 1 && <div className="w-0.5 h-20 md:h-32 bg-gradient-to-b from-primary-500 to-transparent mt-2" />}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4 md:mt-0 md:flex-1 ml-4 md:ml-0">
                  <Card>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                        <Badge variant="primary">{item.year}</Badge>
                      </div>
                      <p className="text-slate-400">{item.body}</p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        className="mb-16 sm:mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Code2 className="w-5 h-5 text-primary-400" />
            <h2 className="text-3xl sm:text-4xl font-bold">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Skills</span>
            </h2>
          </motion.div>

          {/* Skills Grid */}
          {skillsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} variant="rounded" height={40} className="w-full" />
              ))}
            </div>
          ) : skills && skills.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill: any, index: number) => (
                <motion.div
                  key={skill.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Badge variant="primary" className="w-full text-center justify-center py-3 px-4 text-sm font-semibold cursor-default hover:bg-primary-500/30 transition-colors duration-200">
                    {skill.name}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-8">
              <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-50" />
              <p className="text-slate-400">Skills will be displayed here</p>
            </Card>
          )}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="card-lg space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <Target className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-100">Let's Work Together</h3>
            <p className="text-slate-400">
              I'm always interested in hearing about new projects and opportunities. Feel free to reach out if you'd like to collaborate!
            </p>
          </div>
        </div>
        <a href="/contact" className="inline-flex text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200 group">
          Get in touch →
          <span className="group-hover:translate-x-1 transition-transform duration-200 ml-1">→</span>
        </a>
      </motion.div>
    </motion.section>
  );
}
