"use client";

import useSWR from "swr";
import api from "../lib/api";
import ProjectCard from "../components/ProjectCard";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MotionSection, MotionDiv } from "../lib/motion";
import { Button } from "../components/ui/Button";
import { ProjectGridSkeleton } from "../components/ui/Skeleton";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Zap, Star, Users, Trophy } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

// Premium animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export default function Home() {
  const { data: projects, isLoading } = useSWR("/projects", fetcher);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Scroll-based parallax effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Animated counter hook
  const useAnimatedCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
      if (!isInView) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [end, duration, isInView]);

    return { count, ref: nodeRef };
  };

  const projectsCount = useAnimatedCounter(50);
  const experienceCount = useAnimatedCounter(5);
  const clientsCount = useAnimatedCounter(30);

  return (
    <MotionSection className="overflow-hidden relative">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={floatingAnimation}
          style={{ animationDelay: '0s' }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/8 to-primary-500/8 rounded-full blur-3xl"
          animate={floatingAnimation}
          style={{ animationDelay: '2s' }}
        />
        <motion.div
          className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-emerald-500/6 to-primary-500/6 rounded-full blur-3xl"
          animate={floatingAnimation}
          style={{ animationDelay: '4s' }}
        />

        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-500/2 to-transparent" />
      </div>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative py-20 sm:py-28 md:py-36 lg:py-44"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-8 sm:space-y-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Status Indicator */}
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-center w-fit mx-auto"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-cyan-400/10 border border-primary-500/20 backdrop-blur-sm">
                <motion.div
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                  Available for new projects
                </span>
                <Sparkles className="w-4 h-4 text-primary-400" />
              </div>
            </motion.div>

            {/* Main Heading with Premium Typography */}
            <motion.div variants={staggerItem} className="space-y-6 text-center">
              <motion.h1
                className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <motion.span
                  className="block bg-gradient-to-r from-slate-100 via-primary-200 to-cyan-200 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Full-Stack
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-primary-400 via-primary-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Developer
                </motion.span>
                <motion.span
                  className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-400 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  & Designer
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl lg:text-3xl text-slate-300 leading-relaxed max-w-4xl mx-auto font-light"
                variants={staggerItem}
              >
                Crafting <span className="text-gradient font-semibold">high-performance</span> web applications with modern technologies.
                Specialized in <span className="text-gradient font-semibold">Next.js, React, Node.js</span> and cloud solutions for scalable products.
              </motion.p>
            </motion.div>

            {/* Premium CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <Link href="/projects">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-6 h-6" />}
                  iconPosition="right"
                  className="group"
                >
                  <span className="relative z-10">Explore My Work</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="backdrop-blur-sm bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50"
                >
                  Let's Connect
                </Button>
              </Link>
            </motion.div>

            {/* Premium Stats Section */}
            <motion.div
              ref={statsRef}
              variants={staggerItem}
              className="grid grid-cols-3 gap-6 sm:gap-8 pt-12 max-w-2xl mx-auto"
            >
              {[
                {
                  value: projectsCount.count,
                  label: "Projects",
                  suffix: "+",
                  icon: Code2,
                  gradient: "from-primary-500 to-cyan-400",
                },
                {
                  value: experienceCount.count,
                  label: "Years Experience",
                  suffix: "+",
                  icon: Trophy,
                  gradient: "from-emerald-500 to-primary-500",
                },
                {
                  value: clientsCount.count,
                  label: "Happy Clients",
                  suffix: "+",
                  icon: Users,
                  gradient: "from-violet-500 to-primary-500",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center space-y-3 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                >
                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} p-3 shadow-lg group-hover:shadow-glow`}>
                      <stat.icon className="w-full h-full text-white" />
                    </div>
                  </motion.div>

                  <div className="space-y-1">
                    <motion.div
                      ref={idx === 0 ? projectsCount.ref : idx === 1 ? experienceCount.ref : clientsCount.ref}
                      className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {stat.value}{stat.suffix}
                    </motion.div>
                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Projects Section */}
      <motion.div
        className="relative py-20 sm:py-28 md:py-36"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent" />

        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header */}
          <motion.div
            className="space-y-6 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500/20 to-cyan-400/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400 uppercase tracking-wider">
                Featured Work
              </span>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black">
                Recent <span className="text-gradient animate-gradient-shift">Projects</span>
              </h2>
            </motion.div>

            <motion.p
              variants={staggerItem}
              className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto"
            >
              Explore a selection of my recent works showcasing various technologies and design approaches.
              Each project represents a unique challenge and innovative solution.
            </motion.p>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <ProjectGridSkeleton count={3} />
          ) : projects && projects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.slice(0, 3).map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                <Code2 className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg">No projects available yet</p>
              <p className="text-slate-500 text-sm mt-2">Check back soon for amazing work!</p>
            </motion.div>
          )}

          {/* Enhanced View All Button */}
          <motion.div
            className="flex justify-center pt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/projects">
              <Button
                variant="tertiary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="group backdrop-blur-sm bg-slate-800/30 border-primary-500/30 hover:bg-primary-500/10"
              >
                <span className="relative z-10">View All Projects</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium CTA Section */}
      <motion.div
        className="relative py-20 sm:py-28 md:py-36"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* CTA Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-cyan-400/5" />

        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={staggerItem}
              className="flex justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-cyan-400 p-4 shadow-2xl shadow-primary-500/20">
                <Zap className="w-full h-full text-white" />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
                Ready to start your <span className="text-gradient">next project</span>?
              </h2>

              <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                I'm always open to new projects and collaboration opportunities. Let's create something amazing together that pushes the boundaries of what's possible.
              </p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-6 h-6" />}
                  iconPosition="right"
                  className="group"
                >
                  <span className="relative z-10">Start a Conversation</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="backdrop-blur-sm bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50"
                >
                  Learn More About Me
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </MotionSection>
  );
}

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
