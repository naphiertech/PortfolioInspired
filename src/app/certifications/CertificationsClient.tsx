"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { certifications } from "@/lib/data";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const, // custom cubic bezier
    },
  },
};

export function CertificationsClient() {
  return (
    <div className="min-h-screen bg-bg-primary dark:bg-dark-bg-primary text-text-primary dark:text-dark-text-primary pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-6 mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary">
            All Certifications
          </h1>
        </motion.div>

        {/* Clean Border Grid with Animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border-default dark:border-dark-border"
        >
          {certifications.map((cert, index) => (
            <motion.a
              key={index}
              variants={itemVariants}
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-r border-border-default dark:border-dark-border p-8 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary transition-all duration-300"
            >
              <div className="flex flex-col gap-3 h-full justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-text-primary dark:text-dark-text-primary group-hover:text-accent dark:group-hover:text-accent transition-colors">
                    {cert.name}
                  </h2>
                  <p className="text-[14px] text-text-secondary dark:text-dark-text-secondary leading-relaxed font-normal">
                    Issued by {cert.issuer}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-block px-2.5 py-1 rounded bg-[#f4f4f5] dark:bg-[#18181b] border border-border-default dark:border-dark-border text-xs font-mono text-[#27272a] dark:text-zinc-300 transition-colors group-hover:border-accent/30 dark:group-hover:border-accent/30">
                    Verify Credential
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default CertificationsClient;
