"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { mainNav } from "../lib/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Navigation",
      links: mainNav,
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "GitHub", href: "#" },
        { label: "Resume", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Mail, label: "Email", href: "mailto:your@email.com" },
  ];

  return (
    <footer className="bg-gradient-to-b from-transparent to-slate-900/80 border-t border-slate-700/30 backdrop-blur-sm">
      {/* Main Content */}
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          {/* Brand Section */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">EB</div>
              <span className="font-extrabold text-lg text-slate-100">Ebuka</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">Full-stack developer crafting high-performance web applications with modern technologies.</p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a key={label} href={href} title={label} className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-200" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Sections */}
          {sections.map((section, idx) => (
            <motion.div key={section.title} className="space-y-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx + 1) * 0.1 }}>
              <h3 className="text-sm font-semibold text-slate-200">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200 inline-flex items-center gap-1 group">
                      {link.label}
                      {typeof link.href === 'string' && link.href.startsWith && link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-10 sm:my-12" />

        {/* Bottom Section */}
        <motion.div className="flex flex-col sm:flex-row justify-between items-center gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <p className="text-xs sm:text-sm text-slate-500">© {currentYear} Ebuka Portfolio. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-200">Privacy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-200">Terms</a>
            <motion.button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs text-slate-500 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1" whileHover={{ y: -2 }}>Back to top ↑</motion.button>
          </div>
        </motion.div>
      </div>

      {/* Gradient background effects */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-50" />
    </footer>
  );
}
