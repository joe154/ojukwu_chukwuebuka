"use client";

import useSWR from "swr";
import api from "../../lib/api";
import ProjectCard from "../../components/ProjectCard";
import { motion } from "framer-motion";
import { MotionSection, MotionDiv } from "../../lib/motion";
import { Button } from "../../components/ui/Button";
import { ProjectGridSkeleton } from "../../components/ui/Skeleton";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

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

export default function Home() {
  const { data: projects, isLoading } = useSWR("/projects", fetcher);

  return (
    <MotionSection className="overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative py-12 sm:py-16 md:py-24 lg:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-500/5 to-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 w-fit">
                <motion.div
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                  Welcome to my portfolio
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="block">Full-Stack</span>
                <span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-cyan-400 bg-clip-text text-transparent">
                  Developer & Designer
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Crafting high-performance web applications with modern technologies. Specialized in Next.js, React, Node.js, and cloud solutions for scalable products.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link href="/projects">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  View My Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-slate-700/30">
              {[
                { value: "50+", label: "Projects" },
                { value: "5+", label: "Years Experience" },
                { value: "30+", label: "Happy Clients" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Projects Section */}
      <motion.div
        className="py-12 sm:py-16 md:py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                Featured Work
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Projects</span>
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-slate-400 max-w-2xl">
              Explore a selection of my recent works showcasing various technologies and design approaches.
            </motion.p>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <ProjectGridSkeleton count={3} />
          ) : projects && projects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.slice(0, 3).map((project: any) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="card text-center py-16">
              <Code2 className="w-12 h-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No projects available yet</p>
            </div>
          )}

          {/* View All Button */}
          <motion.div
            className="flex justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/projects">
              <Button variant="tertiary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                View All Projects
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-12 sm:py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-lg max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <Zap className="w-12 h-12 text-primary-400" />
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold">
              Ready to start your next project?
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-slate-300">
              I'm always open to new projects and collaboration opportunities. Let's create something amazing together.
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/contact">
              <Button variant="primary" size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </MotionSection>
  );
}
